
// creating new items
var addNewItemButton = $('#addNewItem') // document.getElementById("addNewItem");
$('#addNewItem').click(function() {
    var newTitle = $('#newItemTitle'); 
    var newContent = $('#newItemContent');

// to post the new item which was created
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/items");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        var returnedItem = JSON.parse(xhr.response);
        console.log(showItem);
        showItem(returnedItem);
        newTitle.val(""); // to clear the 'title field' in the form 
        newContent.val(""); // to clear the 'content field' in the form
    });

    var newItem = {
        title: newTitle.val(),
        content: newContent.val()
    }
    xhr.send(JSON.stringify(newItem));
})

// to create li for the items
var createLiForItem = function(li, item) {
    li.text("");
    li.attr("id", "item" + item.id);

    var spanForText = $('<span></span>');
    spanForText.css('margin', '10px');
    spanForText.text(item.title)
    li.append(spanForText);

// making the item.title a link which on click (event listener) will display the edit form
    li.click(function() {
        editItem(li, item.title, item.content);
    });
    li.append(li);
  
    // creating delete button and adding event listener (click) to the delete button
    var deleteButton = $('<button>Delete</button>') // document.createElement("button");
    deleteButton.click(fnDeleteItem);
        li.append(deleteButton);
    }
// to show individual item
var showItem = function(item) {
    var li = $('<li></li>'); // document.createElement("li")
    createLiForItem(li, item);
    var ul = $('#itemsList') // document.getElementById("itemsList");
    ul.append(li);
};

// to show all items
var showAllItems = function() {
    $.get( "http://localhost:3000/items", function(data) {
        console.log(data);
        var items = data;
        items.forEach(function(item) {
            showItem(item);
        })
    });
}
// create a function for editing items
var editItem = function(li, title, content) {
    var id = li.attr('id').substring(4);

    var div = $("#edit");

    var br = $("<br></br>");
    
    div.empty();
    
// creating a text input for 'title' for editing the same
    var titleField = $('<input></input>') // document.createElement("input");
    titleField.attr("type", "text"); // titleField.setAttribute("type", "text");
    titleField.val(title); // titleField.value = title;
    div.append(titleField); // instead of li.append(titleField);
    // adding a line break
    div.append(br);

// creating a text input for 'content' for editing the same
    var contentField = $('<textarea></textarea>') 
    contentField.attr("type", "text");
    contentField.val(content); // contentField.value = content;
    div.append(contentField); // instead of li.appendChild(contentField);

// creating update button and adding event listener (click) to update an item
    var updateButton = $('<button>Update</button>'); // document.createElement("button");
    updateButton.click(function() {
        var newTitle = titleField.val();
        var newContent = contentField.val();
        updateItem(li, newTitle, newContent);
        div.empty();
    });
    div.append(updateButton);    
};  

// creating a function to update an item after editing
var updateItem = function(li, newTitle, newContent) {
    var id = li.attr('id').substring(4);

    $.ajax({
        url: "http://localhost:3000/item/" + id,
        method: "put",
        data: { title: newTitle, content: newContent }
    }).done(function(data) {
        var returnedItem = data;
        createLiForItem(li, returnedItem);
    });
};

// creating a function to delete an item
var fnDeleteItem = function() {
    var li = this.parentNode;
    var id = li.id.substring(4);


    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "http://localhost:3000/item/" + id);
    xhr.addEventListener("load", function() {
        if (JSON.parse(xhr.responseText).deleted === true) {
            li.remove();
        }
    });
    
    xhr.send();
}

showAllItems();

