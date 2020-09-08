import {apolloClient, getCustomQuery, getSettings} from './../../index';
import defaultQuery from './defaultQuery';
import { buildOrderWhere, resolveCustomQueryVariables } from './../../helpers/search';
import { ProfileResponse } from './../../types/Api';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';

const getOrders = async (params, customQueryFn?) => {
  const { query, variables } = getCustomQuery(customQueryFn, defaultQuery);
  const { locale, acceptLanguage } = getSettings();
  const resolvedVariables = resolveCustomQueryVariables({
    where: buildOrderWhere(params),
    sort: params.sort,
    limit: params.limit,
    offset: params.offset,
    acceptLanguage,
    locale
  }, variables, 'order');
  const request = await apolloClient.query<ApolloQueryResult<ProfileResponse>>({
    query: gql`${query}`,
    variables: resolvedVariables,
    fetchPolicy: 'no-cache'
  });
  return {
    ...request,
    query,
    variables: resolvedVariables
  };
};

export default getOrders;
