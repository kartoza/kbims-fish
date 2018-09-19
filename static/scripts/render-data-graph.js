var pieData = [25, 2, 7, 10, 12, 25, 60];
var pieLabel = ['orange', 'yellow', 'lightgreen', 'green', 'grey', 'black', 'red'];
var pieColor = ['orange', 'yellow', 'lightgreen', 'green', 'grey', 'black', 'red'];
var pieOptions = {
    legend: {
        display: false
    },
    cutoutPercentage: 0,
    maintainAspectRatio: false
};
var categoryOrigin = [];
var originData = {};
var originDataDate = {};

$.ajax({
    url: '/api/fish-collections-site/' + locationSitePk + '/',
    dataType: 'json',
    success: function (data) {
        // reset graph
        $('#fish-timeline-graph').parent().empty().append('<canvas id="fish-timeline-graph" width="150px" height="150px"></canvas>')
        $('#fish-category-graph').parent().empty().append('<canvas id="fish-category-graph" width="150px" height="150px"></canvas>')

        categoryOrigin = [];
        originData = {};
        originDataDate = [];

        $.each(data, function (key, value) {
            if($.inArray(value['category'], categoryOrigin) === -1){
                categoryOrigin.push(value['category'])
            }
        });

        $.each(data, function (key, value) {
            if($.inArray(value['collection_date'], categoryOrigin) === -1){
                originDataDate.push(value['collection_date'])
            }
        });
        console.log(originDataDate);
        console.log(data);
        
        countObjectPerDateCollection(data);
        console.log(dataByDate);

        var filteredDataset = [];
        var dataNumber = [];
        for(var u=0; u<categoryOrigin.length; u++){
            dataNumber = [];
            for(var j=0; j<Object.keys(dataByDate).length; j++){
                dataNumber.push(dataByDate[Object.keys(dataByDate)[j]][categoryOrigin[u]])
            }
            filteredDataset.push({
                label: categoryOrigin[u],
                data: dataNumber,
                backgroundColor: getRandomColor()
            })
        }

        for(var i=0; i<data.length; i++){
            $.each(categoryOrigin, function (idx, val) {
                if(data[i]['category'] === val){
                    if (!(val in originData)){
                        originData[val] = 1
                    }else {
                        originData[val] += 1
                    }
                }
            })
        }

        var occurenceTable = $('<table></table>');
        occurenceTable.append('' +
            '<tr>' +
            '<th>Species name</th><th>Category</th><th>Habitat</th><th>Records</th><th>Notes</th>' +
            '</tr>');
        var recordOccurences = data;
        recordOccurences = slimObjects(recordOccurences);
        console.log(recordOccurences);
        $.each(recordOccurences, function (key, value) {
            var recordTable = $('<tr></tr>');
            recordTable.append('<td>' + value['original_species_name'] +
                '</td><td>' + value['category'] + '</td><td>' + value['habitat'] + '</td><td>' + value['record_occurence'] + '</td><td style="text-align: center"><i class="fa fa-info" data-toggle="tooltip" title="' + value['notes'] + '"></i></td>')

            occurenceTable.append(recordTable);
        });
        $('#occurence-table').html(occurenceTable).prepend('<span>Fish</span>');

        createPieChart(document.getElementById("fish-category-graph").getContext('2d'), Object.values(originData), categoryOrigin, pieOptions, pieColor);
        createPieChart(document.getElementById("origin-graph").getContext('2d'), pieData, pieLabel, pieOptions, pieColor);
        createPieChart(document.getElementById("cons-status-graph").getContext('2d'), pieData, pieLabel, pieOptions, pieColor);
        createTimelineGraph(document.getElementById("fish-timeline-graph").getContext('2d'), originDataDate, filteredDataset)
    }
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createTimelineGraph(canvas, labels, dataset) {
    var myChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: dataset
    },
    options: {
      title: {
          display: true,
          text: 'Origin'
      },
      legend: {
          display: false
      },
      scales: {
         xAxes: [{
             stacked: true,
             scaleLabel: {
                display: true,
                labelString: 'Collection date'
             }
         }],
         yAxes: [{
             stacked: true,
             scaleLabel: {
                display: true,
                labelString: 'Records'
             }
         }]
      }
    }
});
}

var dataByDate = {};
function countObjectPerDateCollection(data) {
    $.each(originDataDate, function (idx, date) {
        dataByDate[date] = {};
        $.each(categoryOrigin, function (index, origin) {
            dataByDate[date][origin] = 0;
           $.each(data, function (key, value) {
                if(value['category'] == origin && value['collection_date'] == date){
                    dataByDate[date][origin] += 1;
                }
            })
        });
    })
}

function slimObjects(object) {
    var newObject = {};
    var species = [];
    var addNewObject = false;
    var idx = 0;
    for(var i=0; i<Object.keys(object).length; i++){
        if(Object.keys(newObject).length > 0) {
            if($.inArray(object[i]['original_species_name'], species) === -1){
                addNewObject = true
            }else {
                $.each(newObject, function (key, obj) {
                    if(obj['original_species_name'] === object[i]['original_species_name']){
                        obj['record_occurence'] += 1;
                    }
                });
                addNewObject = false;
            }
        }else {
            addNewObject = true
        }

        if(addNewObject){
            newObject[idx] = {};
            $.each(object[i], function (index, val) {
                if(index !== 'id' && index !== 'collection_date' && index !== 'collector') {
                    newObject[idx][index] = val
                }
            });
            newObject[idx]['record_occurence'] = 1;
            idx = idx + 1;
            addNewObject = false;
            species.push(object[i]['original_species_name']);
        }
    }

    return newObject
}
