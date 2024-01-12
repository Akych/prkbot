class Queue {
    constructor() {
      this.array = [];
    }
    add(data) {
        this.array.push(data)
    }
    get() {
        let data = this.array.shift()
        return data
    }
    list() {
        return this.array
    }
}
module.exports = Queue