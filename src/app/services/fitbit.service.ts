import { Injectable, Inject } from "@angular/core";
import {  Router } from "@angular/router";
import {DOCUMENT} from "@angular/common";
import { DBService } from './../dbservices/db.service';
import { UserService } from './user.service';
import { HelpService } from './help.service';



import { map, share } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class FitBitService {
    startingOffset: any = 0;
    fitbitAccessToken: any; 
    client_id: any = "22C62Y";
    client_secret: any = "ced65b437bcd88764093097a725abaaa";
    redirect_uri : any = "https://www.medicaltourismco.com/utility/oauth.php"; //mtcmealapp://myinfo";
    currentUser: any; 
	constructor( private router: Router, private userService: UserService,   private dbService: DBService, private helpService: HelpService) {
        this.currentUser =this.helpService.getCurrentUser();
    if(this.currentUser !== null)
    {
      if( this.currentUser["firstname"] !== "")
      this.currentUser["displayname"]  = this.currentUser["firstname"];
      else if( this.currentUser["username"] !== "")
      this.currentUser["displayname"]  = this.currentUser["username"];
      console.log(this.currentUser);
    }
	}
    initialize()
    {

        console.log("FitBitService initialize");
       /*
       OAuth 2.0 Client ID
        22C62Y
        Client Secret
        ced65b437bcd88764093097a725abaaa
        Redirect URL
        https://www.medicaltourismco.com/utility/oauth.php
        OAuth 2.0: Authorization URI
        https://www.fitbit.com/oauth2/authorize
        OAuth 2.0: Access/Refresh Token Request URI
        https://api.fitbit.com/oauth2/token
        */



        if (!window.location.hash) {
      //      window.location.replace('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=' + this.client_id + '&redirect_uri=' + this.redirect_uri + '&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight');
        } else {
            console.log(window.location.hash);
            var fragmentQueryParameters = {};
         //   window.location.hash.slice(1).replace(
         //       new RegExp("([^?=&]+)(=([^&]*))?", "g"),
           //     function($0, $1, $2, $3) { fragmentQueryParameters[$1] = $3; }
        //    );
        
         //   this.fitbitAccessToken = fragmentQueryParameters["access_token"];
        }
        var processResponse = function(res) {
            if (!res.ok) {
                throw new Error('Fitbit API request failed: ' + res);
            }
         
            var contentType = res.headers.get('content-type')
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return res.json();
            } else {
                throw new Error('JSON expected but received ' + contentType);
            }
        }
        
        var processHeartRate = function(timeSeries) {
            return timeSeries['activities-heart-intraday'].dataset.map(
                function(measurement) {
                    return [
                        measurement.time.split(':').map(
                            function(timeSegment) {
                                console.log(timeSegment);
                                return Number.parseInt(timeSegment);
                            }
                        ),
                        measurement.value
                    ];
                }
            );
        }
        
        /*
        var graphHeartRate = function(timeSeries) {
            console.log(timeSeries);
            var data = new google.visualization.DataTable();
            data.addColumn('timeofday', 'Time of Day');
            data.addColumn('number', 'Heart Rate');
        
            data.addRows(timeSeries);
        
            var options = google.charts.Line.convertOptions({
                height: 450
            });
        
            var chart = new google.charts.Line(document.getElementById('chart'));
        
            chart.draw(data, options);
        } */
        
        fetch(
            'https://api.fitbit.com/1/user/-/activities/heart/date/2016-03-19/1d/1sec/time/21:00/23:00.json',
            {
                headers: new Headers({
                    'Authorization': 'Bearer ' + this.fitbitAccessToken
                }),
                mode: 'cors',
                method: 'GET'
            }
        ).then(processResponse)
        .then(processHeartRate)
       // .then(graphHeartRate)
        .catch(function(error) {
            console.log(error);
        });
    }
   

    authoriseWithFitbit(access_token): void {

        var parent = this; 
      
          /*
<a href="https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22CVMG&redirect_uri=https%3A%2F%2Flocalhost%2Ffitbit-api-javascript%2F&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800">
Login to Fitbit
</a>
         
 */

          console.log("loadRefreshToken");
          var url = "https://www.fitbit.com/oauth2/authorize";
  
          var strBody = "response_type=code&client_id=" + this.client_id + "&redirect_uri=" + this.redirect_uri +"scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=31536000";
          console.log(strBody);
  
          fetch(url, {
              method: "POST",
              body: strBody,
              headers: {
              'Authorization': 'Basic ' + "MjJDNjJZOmNlZDY1YjQzN2JjZDg4NzY0MDkzMDk3YTcyNWFiYWFh",
              "Content-Type": "application/x-www-form-urlencoded"
              }
          })
          .then(response => response.json())
          .then(json => console.log(json));

    }

    
    loadRecoverToken()
    {
        console.log("loadRefreshToken");
        var url = "https://api.fitbit.com/oauth2/recover";

        var strBody = "client_id=22C62Y&grant_type=refresh_token";
        console.log(strBody);

        fetch(url, {
            method: "POST",
            body: strBody,
            headers: {
            'Authorization': 'Basic ' + "MjJDNjJZOmNlZDY1YjQzN2JjZDg4NzY0MDkzMDk3YTcyNWFiYWFh",
            "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(response => response.json())
        .then(json => console.log(json));

    }

    loadRefreshToken(access_token)
    {
        console.log("loadRefreshToken");
        var url = "https://api.fitbit.com/oauth2/token";

        var strBody = "client_id=" + access_token["user_id"] + "&grant_type=authorization_code&redirect_uri=" + this.redirect_uri + "&code=" + access_token["access_token"];
        console.log(strBody);

        fetch(url, {
            method: "POST",
            body: strBody,
            headers: {
            'Authorization': 'Basic ' + "MjJDNjJZOmNlZDY1YjQzN2JjZDg4NzY0MDkzMDk3YTcyNWFiYWFh",
            "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(response => response.json())
        .then(json => console.log(json));

    }
 
     setUserInfo(success)
     {
         console.log("In setUserInfo");
         var access_token = success["access_token"];
         var user_id = success["user_id"];
         if(!this.currentUser)
         {
            this.currentUser =this.helpService.getCurrentUser();
         }
        if(this.currentUser !== null)
        {
            var params = {};
            params["value"] = access_token;
            params["type"] = "access_token";
            params["vendor"] = "fitbit";
            params["userid"] = this.currentUser["id"];
            var res =   this.dbService.getDataByTable("userinfo",params).subscribe(invData => setTimeout(() => 
            {
              console.log(invData);
             
              if(invData !==null && invData["body"]["length"] > 0)
              {
                params["id"] =invData["body"][0]["id"];
                this.updateData("userinfo", params);
              }
              else
              {
                this.createData("userinfo", params);
              }
            }));


            var params1 = {};
            params1["value"] = user_id;
            params1["type"] = "user_id";
            params1["vendor"] = "fitbit";
            params1["userid"] = this.currentUser["id"];
            var res =   this.dbService.getDataByTable("userinfo",params1).subscribe(invData => setTimeout(() => 
            {
              console.log(invData);
             
              if(invData !==null && invData["body"]["length"] > 0)
              {
                params1["id"] =invData["body"][0]["id"];
                this.updateData("userinfo", params1);
              }
              else
              {
                this.createData("userinfo", params1);
              }
            }));


        }
     }

    
     loadFitBitData(success)
     {
         console.log("in loadFitBitData");
        var apiToken = success["access_token"];
        var userID = success["user_id"];
        var parent = this;
        this.fitbitAccessToken = apiToken;
        console.log(apiToken);


        var processResponse = function(res) {
            if (!res.ok) {
                throw new Error('Fitbit API request failed: ' + res);
            }
         
            var contentType = res.headers.get('content-type')
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return res.json();
            } else {
                throw new Error('JSON expected but received ' + contentType);
            }
        }
        
        var processResult = function(timeSeries) {
            console.log("processResult");
            console.log(timeSeries);
            parent.saveDataTrackings(timeSeries, "steps", 1);
            /*return timeSeries['activities-steps-intraday'].dataset.map(
                function(measurement) {
                    return [
                        measurement.time.split(':').map(
                            function(timeSegment) {
                                console.log(timeSegment);
                                return Number.parseInt(timeSegment);
                            }
                        ),
                        measurement.value
                    ];
                }
            );*/
        }
          
        fetch(
          //  'https://api.fitbit.com/1/user/' + userID + '/activities/steps/date/today/1m.json',
          'https://api.fitbit.com/1/user/' + userID + '/activities/steps/date/today/1m.json',
            {
                headers: new Headers({
                    'Authorization': 'Bearer ' + this.fitbitAccessToken
                }),
                mode: 'cors',
                method: 'GET'
            }
        ).then(processResponse)
        .then(processResult)
       // .then(graphHeartRate)
        .catch(function(error) {
            console.log(error);
        });

       
     }

    

     loadFitBitDatacalories(success)
     {  var parent = this;
        var apiToken = success["access_token"];
        var userID = success["user_id"];
 
        this.fitbitAccessToken = apiToken;
        console.log(apiToken);


        var processResponseCalories = function(res) {
            console.log("processResponseCalories");
            if (!res.ok) {
                throw new Error('Fitbit API request failed: ' + res);
            }
         
            var contentType = res.headers.get('content-type')
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return res.json();
            } else {
                throw new Error('JSON expected but received ' + contentType);
            }
        }
        /*
        if(type== "steps") typeid = 1;
        if(type== "calories") typeid = 2;
        if(type== "distance") typeid = 3;
      */
        var processResultCalories = function(timeSeries) {
            console.log("processResultCalories");
            console.log(timeSeries);
            parent.saveDataTrackings(timeSeries, "calories", 2);
           /* return timeSeries['activities-calories-intraday'].dataset.map(
                function(measurement) {
                    return [
                        measurement.time.split(':').map(
                            function(timeSegment) {
                                console.log(timeSegment);
                                return Number.parseInt(timeSegment);
                            }
                        ),
                        measurement.value
                    ];
                }
            );*/
        }
          
        fetch(
          'https://api.fitbit.com/1/user/' + userID + '/activities/calories/date/today/1m.json',
            {
                headers: new Headers({
                    'Authorization': 'Bearer ' + this.fitbitAccessToken
                }),
                mode: 'cors',
                method: 'GET'
            }
        ).then(processResponseCalories)
        .then(processResultCalories)
       // .then(graphHeartRate)
        .catch(function(error) {
            console.log(error);
        });


     }

     loadFitBitDatadistance(success)
     {
         var parent = this;
        var apiToken = success["access_token"];
        var userID = success["user_id"];

        this.fitbitAccessToken = apiToken;
        console.log(apiToken);


        var processResponsedistance = function(res) {
            console.log("processResponsedistance");
            if (!res.ok) {
                throw new Error('Fitbit API request failed: ' + res);
            }
         
            var contentType = res.headers.get('content-type')
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return res.json();
            } else {
                throw new Error('JSON expected but received ' + contentType);
            }
        }
        
        var processResultdistance = function(timeSeries) {
            console.log("processResultdistance");
            console.log(timeSeries);
            parent.saveDataTrackings(timeSeries, "distance", 3);
           /* return timeSeries['activities-distance-intraday'].dataset.map(
                function(measurement) {
                    return [
                        measurement.time.split(':').map(
                            function(timeSegment) {
                                console.log(timeSegment);
                                return Number.parseInt(timeSegment);
                            }
                        ),
                        measurement.value
                    ];
                }
            ); */
        }
          
        fetch(
          'https://api.fitbit.com/1/user/' + userID + '/activities/distance/date/today/1m.json',
            {
                headers: new Headers({
                    'Authorization': 'Bearer ' + this.fitbitAccessToken
                }),
                mode: 'cors',
                method: 'GET'
            }
        ).then(processResponsedistance)
        .then(processResultdistance)
       // .then(graphHeartRate)
        .catch(function(error) {
            console.log(error);
        });


     }
     fitbitInAppAutherize()
     {
        console.log("fitbitInAppAutherize");
  
     }


     /*************8 save data */

     saveDataTrackings(data, type, typeid)
     {
         console.log(type);
         var obj = data["activities-" + type];
         for(let i=0; i< obj.length; i++)
         {
            var params = {};
            params["starttime"] = obj[i]["dateTime"];
            params["endtime"] = obj[i]["dateTime"];
            params["measure"] = obj[i]["value"];
            params["unit"] = "";
            params["type"] = typeid;
            params["userid"] =  this.currentUser["id"];
            params["vendor"] = "fitbit";
            if(typeid == 1)
            {   console.log(params);

            }
         
            this.saveData(params);
         }
        
     }
     saveData(params)
  {
 //   console.log("save data");
 //   console.log(params);
    var paramsCheck = {};
    paramsCheck["starttime"] = params["starttime"];
    paramsCheck["type"] = params["type"];
    paramsCheck["userid"] = params["userid"];
    paramsCheck["vendor"] = "fitbit";
    //console.log(paramsCheck);
    var res =   this.dbService.getDataByTable("workouts",paramsCheck).subscribe(invData => setTimeout(() => 
    {
   //  console.log(invData);
      if(invData !==null && invData["body"]["length"] > 0)
      {
        params["id"] =invData["body"][0]["id"];
        this.updateData("workouts", params);
      }
      else
      {
        this.createData("workouts",params);
      }
    }));
  
   
  }
  
  createData(tablename, params)
  {
 //   console.log("In createData")
  //  console.log(params);
  try
  {
    var res =   this.dbService.postDataByTable(tablename,params).subscribe(invData => setTimeout(() => 
    {
      
      
    }));
  }
  catch(Error)
  {
      console.log("Error");
      console.log(Error);
  }
   
  }

  updateData(tablename, params)
  {
 //   console.log("In updateData");
 //   console.log(params);
    try
    {
        var res =   this.dbService.updateDataByTable(tablename,params).subscribe(invData => setTimeout(() => 
        {
            console.log(invData);
        
        }));
    }
    catch(error)
    {
        console.log("error");
        console.log(error);
    }
   
  }

}
