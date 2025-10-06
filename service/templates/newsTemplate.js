const moment = require("moment-timezone");
const url = "https://api.srivarumotors.com/";
module.exports = function HTML_TEMPLATE(content, type) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mail</title>
    <style>
        .container{
            width: 50%;
            margin: auto;
            background-color: #c7c1c1;
            padding: 16px;
        }
        .header{
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
            margin-bottom: 20px;
            font-size: 39px;
            text-transform: capitalize;
        }
        .img-part{
            height: 300px;
        }
        .img-part img{
            width: 100%;
            height: 88%;
        }
        .img-part P{
            height: 12%;
            text-align: center;
            background-color:  #11116d;
            margin: -5px 0 0 0 !important;
            display: grid;
            place-items: center;
            color: white;
        }
        .details{
            background-color: #fff;
            padding: 20px 12px;
        }
        .details h2{
            font-weight: 500;
        }
        .details button{
            padding: 7px 12px;
            border: 1px solid black;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container" >
        <div class="header">
            ${type}
        </div>
        <div class="img-part" >
            <img src="${url}${content.image}" alt="">
            <p>${moment(content.published_date)
              .tz("Asia/Kolkata")
              .format("DD/MM/YYYY")}</p>
        </div>
        <div class="details">
            <h2>${content.title}</h2>
            <p>${content.short_description}</p>
            <a href="https://srivarumotors.com/${type}/${
    content.id
  }">View Article</a>
        </div>
    </div>
</body>
</html>`;
};
