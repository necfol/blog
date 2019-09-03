var express = require('express')
var fs = require('fs')
var formidable = require('formidable')
var graphqlHTTP = require('express-graphql')
var { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLInputObjectType } = require('graphql')

var UploadType = new GraphQLInputObjectType({
  name: 'upload',
  fields: {
    name: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    },
    size: {
      type: GraphQLInt,
    },
    path: {
      type: GraphQLString,
    }
  }
})
var ImgType = new GraphQLObjectType({
  name: 'img',
  fields: {
    url: {
      type: GraphQLString,
    }
  }
})

var MyMutationType = new GraphQLObjectType({
  name: 'mymutation',
  fields: {
    uploadImg: {
      type: ImgType,
      args: {
        img: { type: UploadType }
      },
      resolve: (_, { img }) => {
        const { name: imgName, path } = img
        const tmparr = imgName.split('.')
        const ext = tmparr[tmparr.length - 1]
        const file = `${path}.${ext}`
        fs.renameSync(path, file)
        return { url: 'http://localhost:4000/' + file.replace(/^public\//, '') }
      }
    },
  }
})
var MyqueryType = new GraphQLObjectType({
  name: 'myquery',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => {
        return 'hello'
      }
    }
  }
})

var schema = new GraphQLSchema({
  query: MyqueryType,
  mutation: MyMutationType,
})
var app = express()
const middleware = async (req, res, next) => {
  if (req.is('multipart/form-data')) {
    const form = formidable.IncomingForm({
      uploadDir: './public'
    })
    req.body = await new Promise((resolve, reject) => {
      form.parse(req, (error, data, files) => {
        let opts = data.opts
        opts = JSON.parse(opts)
        if (files.img) {
          const { name, type, size, path } = files.img
          opts.variables.img = { name, type, size, path }
        }
        resolve(opts)
      })
    })
  }
  next()
}
app.use(middleware)
app.use(express.static('public'))
app.use('/graphql', graphqlHTTP((request, response) => ({
  schema: schema,
  context: request,
  graphiql: true,
})))
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')