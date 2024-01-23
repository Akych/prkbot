// to fix single thread pupperteer generation
class queue {
    constructor(){
        this.queue = []
        this.idle = true
        this.bannedusers = {}
    }

    add(task){
        if(task.userid){
            console.log(task.userid)
            if(this.userHasBan(task.userid)){
                console.log("user banned")
                return false
            }
           // this.userBan(task.userid)
        }
        this.queue.push(task)
        this.#startworker()
        return true
    }
    #get(){
        return this.queue.shift()
    }
    #count(task){
        return this.queue.length
    }
    #startworker(){
        if(!this.idle) return
        this.idle = false
        console.log("start worker")
        this.#worker()
    }
    async #worker(){
        if(this.#count()>0){
            const task = this.#get()
            await task.func()
            if(task.userid){
                if(this.userHasBan(task.userid)){
                    this.userUnBan(task.userid)
                }
            }
            this.#worker()
        }else{
            console.log("worker idle")
            this.idle = true
        }
    }

    userUnBan(id){
        this.bannedusers[id] = null
    }
    userBan(id){
        this.bannedusers[id] = true
    }
    userHasBan(id){
        return this.bannedusers[id]
    }

}
const tasker = new queue()
module.exports = tasker