var express = require('express')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')

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

// 使用 GraphQL Schema Language 创建一个 schema
var schema = buildSchema(`
  type Item {
    itemId: Int
    itemName: String
    mainImage: String
    price: String
    unit: String
    shopId: String
    shopName: String
    lowPrice: String
    highPrice: String
  }
  type RecommendItem {
    itemId: Int
    itemName: String
    mainImage: String
    price: String
    unit: String
    getComment(id: Int): [Comment]
  }
  type Comment {
    id: Int
    rate: Float
    comment: String
  }
  input ItemInput {
    itemName: String
    price: String
    unit: String
  }
  type Query {
    getItemInfo: Item
    getRecommendItemList(id: Int): [RecommendItem]
  }
  type Mutation {
    updateItemInfo(item: ItemInput): Item
  }
`)

// root 提供所有 API 入口端点相应的解析器函数
var root = {
  getItemInfo: async () => {
    return itemInfo
  },
  getRecommendItemList: ({ id }) => {
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
        // itemName: '91号汽油-2',
        mainImage: 'http://www.terminus.com',
        price: '1234',
        unit: '吨',
        getComment: getComment(id)
      },
    ]
    return data.filter(({ itemId }) => itemId === id)
  },
  updateItemInfo: ({ item }) => {
    itemInfo = { ...itemInfo, ...item }
    return itemInfo
  }
}

var app = express()
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')