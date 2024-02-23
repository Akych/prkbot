module.exports = {
    func:async (ctx)=>{
        await ctx.api.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id);
    },
}