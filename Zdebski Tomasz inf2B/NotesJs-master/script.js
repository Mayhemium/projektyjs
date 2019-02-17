function Note(title,content){
    this.title = title;
    this.content = content;
    this.color;
    this.pinned = false;
    this.created = Date.now();

    this.pin = function(){
        this.pinned = true;
    }
    this.unpin = function(){
        this.pinned = false;
    }
}

let note = new Note("tit","con");