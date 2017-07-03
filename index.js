const fs = require('fs');
const path = require("path");
const helper = require("./helper");
const Crawler = require("crawler");

const  dict = [
  'http://www.programmerinterview.com/index.php/database-sql',
  'http://www.programmerinterview.com/index.php/javascript',
  'http://www.programmerinterview.com/index.php/data-structures',
  'http://www.programmerinterview.com/index.php/design-pattern-questions',
  'http://www.programmerinterview.com/index.php/networking',
  'http://www.programmerinterview.com/index.php/c-cplusplus',
  'http://www.programmerinterview.com/index.php/java-questions',
  'http://www.programmerinterview.com/index.php/job-advice',
  'http://www.programmerinterview.com/index.php/puzzles',
  'http://www.programmerinterview.com/index.php/american-vocabulary',
  'http://www.programmerinterview.com/index.php/technical-vocabulary',
  'http://www.programmerinterview.com/index.php/html5',
  'http://www.programmerinterview.com/index.php/operating-systems',
  'http://www.programmerinterview.com/index.php/recursion',
  'http://www.programmerinterview.com/index.php/general-miscellaneous',
  'http://www.programmerinterview.com/index.php/non-technical-questions'
];

var i = 0;
var c = new Crawler({
  rateLimit: 1000,
  maxConnections : 1,
  // This will be called for each crawled page
  callback : function (error, res, done) {
    if(error){;
        console.log(error);
    }else{
      let current = res.request.uri.href; // requested url
      let title = current.split("/").slice(-2)[0]; // to be the file name
      let folder = current.split("/").slice(-3)[0]; // to be the folder name

      console.log("downloading...", title, folder, current);
      let $ = res.$;

      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      let dir = path.resolve(__dirname, folder);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      if (!!title) {
        let filepath = path.resolve(dir, title + ".txt");
        fs.writeFileSync(filepath, current + "\n\n", "utf8");
        fs.appendFileSync(filepath,  $(".entry h1").text().trim(), "utf8");
        $(".entry p").each(function(index) {
            fs.appendFileSync(filepath, $(this).text().trim() + "\n\n");
        });

        // put next page to the queue, same group
        let next = $(".pager .next a").attr("href");
        if (!!next && next.split("/").slice(-3)[0] === folder) {
          c.queue(next);
        } else {
          i++;
          c.queue(dict[i]);
        }
      }
    }
    done();
  }
});

c.queue(dict[0]);

