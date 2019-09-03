var express = require('express')
var graphqlHTTP = require('express-graphql')
var { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLInputObjectType } = require('graphql')
let itemInfo = {
  itemId: 123,
  itemName: '93号汽油',
  mainImage: 'http://www.terminus.com',
  price: '1234',
  unit: '吨',
  shopId: '234',
  shopName: '中海油北京销售公司',
  lowPrice: '222',
  highPrice: '255',
}
let recommendList = []
const getComment = (itemId) => {
  const data = [{
    id: 125,
    rate: 3.5,
    comment: '油的品质很一般'
  }, {
    id: 124,
    rate: 4.5,
    comment: '油的品质很棒！！！'
  }]
  return data.filter(({ id }) => id === itemId)
}
var MyItemType = new GraphQLObjectType({
  name: 'MyItem',
  fields: {
    itemId: {
      type: GraphQLInt,
    },
    itemName: {
      type: GraphQLString,
    },
    mainImage: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLString,
    },
    unit: {
      type: GraphQLString,
    },
    shopId: {
      type: GraphQLString,
    },
    shopName: {
      type: GraphQLString,
    },
    lowPrice: {
      type: GraphQLString,
    },
    highPrice: {
      type: GraphQLString,
    }
  }
})
var Comment = new GraphQLObjectType({
  name: 'comment',
  fields: {
    id: {
      type: GraphQLInt,
    },
    rate: {
      type: GraphQLFloat,
    },
    comment: {
      type: GraphQLString,
    },
  }
})

// getComment(id: Int): [Comment]
var MyRecommendItem = new GraphQLObjectType({
  name: 'MyRecommend',
  fields: {
    itemId: {
      type: GraphQLInt,
    },
    itemName: {
      type: GraphQLString,
    },
    mainImage: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLString,
    },
    unit: {
      type: GraphQLString,
    },
    getComment: {
      type: new GraphQLList(Comment),
      args: {
        id: {
          type: GraphQLInt
        },
      },
      resolve(_, { id }) {
        return getComment(id)
      }
    }

  }
})
var MyRecommendListType = new GraphQLList(MyRecommendItem)

var MyqueryType = new GraphQLObjectType({
  name: 'myquery',
  fields: {
    getItemInfo: {
      type: MyItemType,
      resolve: () => {
        return itemInfo
      }
    },
    getRecommendItemList: {
      type: MyRecommendListType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (_, { id }, context) => {
        const data = [
          {
            itemId: 124,
            itemName: '91号汽油-1',
            mainImage: 'http://www.terminus.com',
            price: '1234',
            unit: '吨',
            getComment: getComment(id)
          },
          {
            itemId: 125,
            itemName: '91号汽油-2',
            mainImage: 'http://www.terminus.com',
            price: '1234',
            unit: '吨',
            getComment: getComment(id)
          },
        ]
        return data.filter(({ itemId }) => itemId === id)
      }
    }
  }
})
var ItemInputType = new GraphQLInputObjectType({
  name: 'ItemInput',
  fields: {
    itemName: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLString,
    },
    unit: {
      type: GraphQLString,
    },
  }
})
var MyMutationType = new GraphQLObjectType({
  name: 'mymutation',
  fields: {
    updateItemInfo: {
      type: MyItemType,
      args: {
        item: { type: ItemInputType }
      },
      resolve: (_, { item }) => {
        itemInfo = { ...itemInfo, ...item }
        return itemInfo
      }
    },
  }
})
var schema = new GraphQLSchema({
  query: MyqueryType,
  mutation: MyMutationType,
})
var app = express()
app.use(express.static('public'))
app.use('/graphql', graphqlHTTP((request, response) => ({
  schema: schema,
  context: request,
  graphiql: true,
})))
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')