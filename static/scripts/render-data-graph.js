var pieData = [25, 2, 7, 10, 12, 25, 60];
var pieColor = ['#2d2d2d', '#565656', '#6d6d6d', '#939393', '#adadad', '#bfbfbf', '#d3d3d3'];
var pieOptions = {
    legend: {
        display: true
    },
    cutoutPercentage: 0,
    maintainAspectRatio: false,
};
var categoryOrigin = [];
var originData = {};
var originDataDate = {};

$.ajax({
    url: '/api/fish-collections-site/' + locationSitePk + '/',
    dataType: 'json',
    success: function (data) {
        // reset graph
        $('#fish-timeline-graph').parent().empty().append('<canvas id="fish-timeline-graph" width="150px" height="150px"></canvas>');
        $('#fish-category-graph').parent().empty().append('<canvas id="fish-category-graph" width="150px" height="150px"></canvas>');
        $('#records-timeline-graph').parent().empty().append('<canvas id="records-timeline-graph" width="150px" height="150px"></canvas>');

        categoryOrigin = [];
        originData = {};
        originDataDate = [];

        $.each(data, function (key, value) {
            if($.inArray(value['category'], categoryOrigin) === -1){
                categoryOrigin.push(value['category'])
            }
        });
        
        countObjectPerDateCollection(data);

        var filteredDataset = [];
        var dataNumber = [];
        var originColor = [];
        for(var u=0; u<categoryOrigin.length; u++){
            dataNumber = [];
            for(var j=0; j<Object.keys(dataByDate).length; j++){
                dataNumber.push(dataByDate[Object.keys(dataByDate)[j]][categoryOrigin[u]])
            }
            var assignedColor = getRandomColor();
            filteredDataset.push({
                label: categoryOrigin[u],
                data: dataNumber,
                backgroundColor: assignedColor
            });
            originColor.push(assignedColor)
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
        var originOptions = {
            maintainAspectRatio: false,
            title: {
              display: true,
              text: 'Origin'
            },
            legend: {
              display: true
            },
            scales: {
             xAxes: [{
                 stacked: true,
                 barPercentage: 0.04,
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
        };

        var recordsOptions = {
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Records'
            },
                legend: {
                display: false
            },
            scales: {
            xAxes: [{
                 barPercentage: 0.04,
                 scaleLabel: {
                    display: true,
                    labelString: 'Collection date'
             }
            }],
            yAxes: [{
                 stacked: true,
                 scaleLabel: {
                    display: true,
                    labelString: 'Number of records'
             }
            }]
            }
        };

        var objectPerDate = {};
        $.each(dataByDate, function (key, value) {
            var totalNum = 0;
            $.each(value, function (category, num) {
                totalNum += num;
            });
            objectPerDate[key] = totalNum;
        });
        var objectDatasets= [{
                        data: Object.values(objectPerDate),
                        backgroundColor: getRandomColor(),
                    }];

        var occurenceTable = $('<table></table>');
        occurenceTable.append('' +
            '<tr>' +
            '<th>Taxon</th><th>Category</th><th>Habitat</th><th>Records</th><th>Notes</th>' +
            '</tr>');
        var recordOccurences = data;
        recordOccurences = slimObjects(recordOccurences);

        $.each(recordOccurences, function (key, value) {
            var recordTable = $('<tr></tr>');
            recordTable.append('<td>' + value['original_species_name'] +
                '</td><td>' + value['category'] + '</td><td>' + value['habitat'] + '</td><td>' + value['record_occurence'] + '</td><td style="text-align: center"><i class="fa fa-info" data-toggle="tooltip" title="' + value['notes'] + '"></i></td>')

            occurenceTable.append(recordTable);
        });
        $('#occurence-table').html(occurenceTable).prepend('<span>Fish</span>');

        createPieChart(document.getElementById("fish-category-graph").getContext('2d'), Object.values(originData), categoryOrigin, pieOptions, originColor);
        createTimelineGraph(document.getElementById("fish-timeline-graph").getContext('2d'), originDataDate, filteredDataset, originOptions);
        createTimelineGraph(document.getElementById("records-timeline-graph").getContext('2d'), originDataDate, objectDatasets, recordsOptions)

        pieOptions['tooltips'] = {
            callbacks: {
                label: function (tooltipItem, data) {
                    return "coming soon";
                }
            }
        }

        createPieChart(document.getElementById("cons-status-graph").getContext('2d'), pieData, ['coming soon'], pieOptions, pieColor);
        createPieChart(document.getElementById("sampling-method-graph").getContext('2d'), pieData, ['coming soon'], pieOptions, pieColor);
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

function createTimelineGraph(canvas, labels, dataset, options) {
    var myChart;
    myChart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: dataset
        },
        options: options
    });
}

var dataByDate = {};
function countObjectPerDateCollection(data) {
    $.each(data, function (key, value) {
        var collection_year = new Date(value['collection_date']).getFullYear();
        if($.inArray(collection_year, originDataDate) === -1){
            originDataDate.push(collection_year)
        }
    });

    $.each(originDataDate, function (idx, year) {
        dataByDate[year] = {};
        $.each(categoryOrigin, function (index, origin) {
            dataByDate[year][origin] = 0;
           $.each(data, function (key, value) {
               var valueYear = new Date(value['collection_date']).getFullYear();
                if(value['category'] == origin && valueYear == year){
                    dataByDate[year][origin] += 1;
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