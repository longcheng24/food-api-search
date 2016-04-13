function saveAtLocal(e){
    var foodRow = $(e).parent().parent().html();
    localString = "food" + Math.round(Math.random()*1000000); //generate random localstorage key
    localStorage.setItem(localString,foodRow) //save food info to localStorage
    drawHistoryTable();
}

function Delete(e){
    var itemName = $(e).parent().prev().html();
    if(confirm("Are you sure to delete " + itemName)){
      var keyId = $(e).parent().siblings().find("p").html(); //get the localStorage key
      localStorage.removeItem(keyId); //delete from localStorage
      drawHistoryTable();
    }
}

function clearAll(){
  if(confirm("Are you sure to clear history table")){
    localStorage.clear(); //clear localStorage
    drawHistoryTable();
  }
}

// draw history table using localStorage data
function drawHistoryTable(){
  if(localStorage.length){
    $('#historyTable').html('<tr><th class="hidden">Local Key</th><th class="hideInSmall">Food Id</th><th>Food Name</th><th>Action</th><th>Nutrients (Click Tag to Check Nutrition)</th></tr>')
    for (var i = 0; i < localStorage.length; i++){
      $('#historyTable').append('<tr><td class="hidden"><p id="localKey">'+localStorage.key(i)+'</p></td>'+localStorage.getItem(localStorage.key(i))+"</tr>");
    }
    btnShowAndHide();
  }else{
    $('#historyTable').html("<h3>You haven't saved any food yet. Use the search box above to search and save your food!</h3>")
  }
}

// check if localStorage supported by user's browser
function localStorageUsable(){
    if(typeof(Storage) !== "undefined") {
      return true;
    }else{
      alert("Sorry, your browser does not support web storage...")
    }
}

// Nutrients string to array
function seperateNutrientsString(string){
  $arr = string.split(" ");
  $arr[1] = parseFloat($arr[1]);
  return $arr;
}

// draw d3 chart
function d3PieChart(evt){
        window.scrollTo(0, 0);
        $("#chart").empty(); //clear chart container
        $(".outerChat").css("display","block")
        var data = [];
        //create data object for chart
        var stringNu = $(evt).parent().next().children().each(function(){
          data.push({"label":seperateNutrientsString($(this).text())[0],"value":seperateNutrientsString($(this).text())[1]})
        });

        //draw pie chart container width and height
        var $container = $('#chart');
        var width = $container.width();
        var height = $container.height();
        var radius = Math.min(width, height) / 2;
        var donutWidth = 110;
        var legendRectSize = 18;
        var legendSpacing = 4;

        //set color
        var color = d3.scale.category20b();

        //set pie chart svg
        var svg = d3.select('#chart')
          .append('svg')
          .attr('width', "100%")
          .attr('height', "100%")
          .append('g')
          .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

        // draw pie
        var arc = d3.svg.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius);

        var pie = d3.layout.pie()
          .value(function(d) { return d.value; })
          .sort(null);

        var path = svg.selectAll('path')
          .data(pie(data))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d, i) {
            return color(d.data.label);
          });

          //legend setup
          var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var height = legendRectSize + legendSpacing;
              var offset =  height * color.domain().length / 2;
              var horz = -2 * legendRectSize;
              var vert = i * height - offset;
              return 'translate(' + horz + ',' + vert + ')';
            });
          legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color);

          legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d; });
}

function btnShowAndHide(){
  //switch display for save and delete button
  $('#historyTable .nbtn').parent().parent().removeClass("hidden");
  $('#historyTable .nbtn').parent().next().addClass("hidden");
}

function saveUser(){
  // save user to localstorage
  var user = $(".userName").val();
  sessionStorage.setItem("UserName",user);
  welcome();
}

function welcome(){
  // check if user info is in localStorage
  if(sessionStorage.UserName){
    $('.welcomeContainer').html("<h3>Welcome back " + sessionStorage.UserName +"</h3>");
  }else{
    $('.welcomeContainer').html('<h3>Let us know who you are please</h3> <input type="text" class="userName" /><button onclick="saveUser()">Submit</button>');
  }
}

function closeNutrient(){
  //close nutrients pie chart
  $(".closeNu").click(function(){
    $(".outerChat").css("display","none")
  })
}

$(document).ready(function(){
  localStorageUsable();
  welcome();
  drawHistoryTable();
  closeNutrient();
})
