# API-WeatherPlatform
RESTful APIs with opendata APIs from Central Weather Bureau, Taiwan 

### Resource
天氣資料來源: [中央氣象局開放資料平臺之資料擷取API](https://opendata.cwb.gov.tw/dist/opendata-swagger.html)

### Database
資料庫內容如下, 使用 MySQL
```
+-------------+--------------+-----------+---------------------+---------------------+--------------+-----------------+-------------------------------------------+
| FLD_account | FLD_username | FLD_phone | FLD_timeInsert      | FLD_timeUpdate      | FLD_password | FLD_loginStatus | FLD_json                                  |
+-------------+--------------+-----------+---------------------+---------------------+--------------+-----------------+-------------------------------------------+
| 234         | jkl          | NULL      | 2019-09-01 12:00:00 | 2019-09-09 12:03:01 | hhh          |               0 | {"locationName": ["台北市"]}               |
| aaa         | user1        | 123       | 2019-09-24 00:00:00 | 2019-09-24 00:00:00 | hhh          |               0 | {"locationName": []}                      |
+-------------+--------------+-----------+---------------------+---------------------+--------------+-----------------+-------------------------------------------+
```

建表指令
```mysql
create table members_new(
    FLD_account varchar(20) not null primary key,
    FLD_password varchar(20) not null,
    FLD_username varchar(20) not null,
    FLD_phone varchar(10),
    FLD_timeInsert datetime not null,
    FLD_timeUpdate datetime not null, 
    FLD_loginStatus bool not null default false, 
    FLD_json varchar(200) not null default '{\"locationName\": []}' );
````
