var db;
const databaseName = 'TarefasBD';
const databaseVersion = 2;
const db_store_name = 'tarefas';

openDb();

function openDb() {
    console.log("open Db");
    var req = window.indexedDB.open(databaseName, databaseVersion);
    req.onsuccess = function (event) {
        db = this.result;
        console.log("open Db done");
    };
    req.onerror = function (event) {
        console.log(req.errorCode);
    };
    req.onupgradeneeded = function(event) { 
        console.log("open DB on upgrade needed");
        var store = event.target.result.createObjectStore(db_store_name, { keyPath: "tarefaId", autoIncrement: true });
        store.createIndex("tarefa", "tarefa", { unique: false });
    };
};

function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

function addItem() {
    var obj = { "tarefa": $("#item").val() };
    var store = getObjectStore(db_store_name, 'readwrite');
    var req;
    req = store.add(obj);
    $("#adicionar-tarefa").show();
};

function imprimirItens() {
    console.log("imprimir lista");
    var store = getObjectStore(db_store_name, 'readonly');
    var lista = $("#lista");
    
    lista.empty();    
    var req;
    
    req = store.openCursor();
    req.onsuccess = function(evt) {
        var cursor = evt.target.result;
    
    
    if(cursor) {
        console.log("cursor ");
        req = store.get(cursor.key);
        req.onsuccess = function(evt){
            var value = evt.target.result
            console.log(value.tarefaId);
            var tarefa = $("<ons-list-item>" + value.tarefa + "<div class='right'><ons-button onclick='excluirItem(" + value.tarefaId + ")'><ons-icon icon ='trash'></ons-icons></ons-button></div></ons-list-item>");
            lista.append(tarefa);
        };
        
        cursor.continue();
    } else {
        console.log("Não existem mais itens.")
    }
    };
}

function excluirItem(id) {
    console.log("Excluir por Id:" + id);
    
    var req = db.transaction(db_store_name, 'readwrite')
                .objectStore("tarefas")
                .delete(id);
    $("#excluir-tarefa").show();
}

function hideDialog(id){
    document.getElementById(id).hide();
    var lista = $("#lista");
    lista.empty();
    fn.load('home.html');
}

window.fn = {};

window.fn.open = function () {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function (page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

document.addEventListener("init", function (event) {
  if (event.target.matches("#home")) {
      imprimirItens();
  }
});

