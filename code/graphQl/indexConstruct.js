var express = require('express')
var graphqlHTTP = require('express-graphql')
var { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString, GraphQLInputObjectType } = require('graphql')
var shopListMap = []
var contactList = []
var MyShopItemType = new GraphQLObjectType({
  name: 'MyShopItem',
  fields: {
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
  }
})
var MyShopListType = new GraphQLList(MyShopItemType)

var MyContactType = new GraphQLObjectType({
  name: 'MyContact',
  fields: {
    userId: {
      type: GraphQLInt,
    },
    userName: {
      type: GraphQLString,
    },
  }
})
var MyContactListType = new GraphQLList(MyContactType)

var MyqueryType = new GraphQLObjectType({
  name: 'myquery',
  fields: {
    getShopList: {
      type: MyShopListType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: () => {
        return shopListMap
      }
    },
    getContactList: {
      type: MyContactListType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: () => {
        return contactList
      }
    }
  }
})
var MyInputShopItemType = new GraphQLInputObjectType({
  name: 'inputShopItem',
  fields: {
    name: {
      type: GraphQLString,
    }
  }
})

var MyInputContactType = new GraphQLInputObjectType({
  name: 'inputContact',
  fields: {
    userName: {
      type: GraphQLString,
    }
  }
})

var MyMutationType = new GraphQLObjectType({
  name: 'mymutation',
  fields: {
    createContactItem: {
      type: MyContactType,
      args: {
        obj: { type: MyInputContactType }
      },
      resolve: (_, { obj }) => {
        var item = {
          userId: contactList.length,
          ...obj
        }
        contactList[contactList.length] = item
        return item
      }
    },
    createShopItem: {
      type: MyShopItemType,
      args: {
        obj: { type: MyInputShopItemType }
      },
      resolve: (_, { obj }) => {
        var item = {
          id: shopListMap.length,
          ...obj
        }
        shopListMap[shopListMap.length] = item
        return item
      }
    },
  }
})
var schema = new GraphQLSchema({
  query: MyqueryType,
  mutation: MyMutationType,
})
var app = express()
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}))
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')