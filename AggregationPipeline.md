Aggregation Pipeline(mongoDB )


    An aggregation pipeline consists of one or more stages that process documents:

    Each stage performs an operation on the input documents. For example, a stage can filter documents, group documents, and calculate values.

    The documents that are output from a stage are passed to the next stage.

    An aggregation pipeline can return results for groups of documents. For example, return the total, average, maximum, and minimum values.

    You can update documents with an aggregation pipeline if you use the stages shown in Updates with Aggregation Pipeline.


    db.orders.aggregate( [
   // Stage 1: Filter pizza order documents by pizza size
   {
      $match: { size: "medium" }
   },
   // Stage 2: Group remaining documents by pizza name and calculate total quantity
   {
      $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } }
   }
    ] )



    match means same as (where clause )
    lookup is same as (joins, see docs) or ho on atlas and in ur schema u have option fr aggregaton then add stages