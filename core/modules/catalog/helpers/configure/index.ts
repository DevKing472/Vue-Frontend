import cloneDeep from 'lodash/cloneDeep'
import { getSelectedVariant, omitSelectedVariantFields } from '../variant';
import { getProductConfiguration, setProductConfigurableOptions } from '../productOptions';
import { filterOutUnavailableVariants, getStockItems } from '../stock';
import { setGroupedProduct, setBundleProducts } from '../associatedProducts';
import Product from '@vue-storefront/core/modules/catalog/types/Product';
import transformMetadataToAttributes from '../transformMetadataToAttributes';
import { hasConfigurableChildren } from './..'

async function configureProductAsync ({
  product,
  configuration,
  attribute,
  options: {
    fallbackToDefaultWhenNoAvailable = true,
    setProductErrors = true,
    setConfigurableProductOptions = true,
    filterUnavailableVariants = false,
    assignProductConfiguration = false,
    separateSelectedVariant = false,
    prefetchGroupProducts = false
  } = {},
  stockItems = [],
  excludeFields,
  includeFields
}) {
  if (filterUnavailableVariants) {
    filterOutUnavailableVariants(product, stockItems)
  }

  // setup bundle or group product
  if (prefetchGroupProducts) {
    await setGroupedProduct(product, { includeFields, excludeFields })
    await setBundleProducts(product, { includeFields, excludeFields })
  }

  // setup configurable product
  if (hasConfigurableChildren(product)) {
    // we don't want to modify configuration object
    let _configuration = cloneDeep(configuration)

    // find selected variant by configuration
    const selectedVariant = getSelectedVariant(product, _configuration, { fallbackToDefaultWhenNoAvailable })

    if (selectedVariant) {
      _configuration = getProductConfiguration({ product, selectedVariant, attribute })

      setProductConfigurableOptions({ product, configuration: _configuration, setConfigurableProductOptions }) // set the custom options

      product.is_configured = true

      omitSelectedVariantFields(selectedVariant)
    }
    if (!selectedVariant && setProductErrors) { // can not find variant anyway, even the default one
      product.errors.variants = 'No available product variants'
    }

    const configuredProduct = {
      ...product,
      ...(assignProductConfiguration ? { configuration: _configuration } : {})
    }
    return {
      ...configuredProduct,
      ...(separateSelectedVariant ? { selectedVariant } : selectedVariant)
    }
  }

  return product
}

async function configureProducts ({
  products,
  attributes_metadata = [],
  configuration = {},
  options = {},
  excludeFields = null,
  includeFields = null
}: any) {
  const productAttributesMetadata = products.map((product) => product.attributes_metadata || [])
  const attribute = transformMetadataToAttributes([attributes_metadata, ...productAttributesMetadata])
  const attributeStateFormat = { list_by_code: attribute.attrHashByCode, list_by_id: attribute.attrHashById }

  let stockItems = []
  if (options.filterUnavailableVariants) {
    stockItems = await getStockItems(products.map(({ _source }) => _source))
  }

  const configuredProducts = await Promise.all((products as Product[]).map(async (product) => {
    const configuredProduct = await configureProductAsync({
      product,
      configuration,
      attribute: attributeStateFormat,
      options: options,
      stockItems,
      excludeFields,
      includeFields
    })
    return configuredProduct as Product
  }))

  return configuredProducts
}

export default configureProducts
