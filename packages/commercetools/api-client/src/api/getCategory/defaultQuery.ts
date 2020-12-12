import gql from 'graphql-tag';
import { CategoryFragment } from './../../fragments';

export default gql`    
  ${CategoryFragment}
  
  fragment Children on Category {
    id
    slug(acceptLanguage: $acceptLanguage)
    name(acceptLanguage: $acceptLanguage)
    childCount
  }

  query categories($where: String, $sort: [String!], $limit: Int, $offset: Int, $acceptLanguage: [Locale!]) {
    categories(where: $where, sort: $sort, limit: $limit, offset: $offset) {
      offset
      count
      total
      results {
        id
        slug(acceptLanguage: $acceptLanguage)
        name(acceptLanguage: $acceptLanguage)
        description(acceptLanguage: $acceptLanguage)
        childCount
        parent {
          ...DefaultCategory
          parent {
            ...DefaultCategory
            parent {
              ...DefaultCategory
            }
          }
        }
        children {
          ...DefaultCategory
        }
      }
    }
  }
`;
