package com.example.szymo.mobileapp.parser;

import android.util.Log;

import com.example.szymo.mobileapp.data.DistanceMatrixData;
import com.google.android.gms.maps.model.LatLng;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by szymo on 19.11.2017.
 */

public class DistanceMatrixParser {

    public DistanceMatrixData parser(final String data) {
        DistanceMatrixData distanceMatrixData = new DistanceMatrixData();
        try {

            final OLPJsonParser p = new OLPJsonParser();
            final OLPJsonParser.OLPJsonContext ctx = p.parse(data);
            final OLPJsonParser.OLPJsonArrayContext rows = ctx.createArrayContext("routes");
            rows.setIndex(0);
            final OLPJsonParser.OLPJsonArrayContext elements = rows.createArrayContext("legs");
            elements.setIndex(0);
           if(elements.exists("distance","text")){
               distanceMatrixData.Distance=elements.value("distance","text").toString();
           }
            if(elements.exists("duration","text")){
                distanceMatrixData.Time=elements.value("duration","text").toString();
            }
            if(elements.exists("start_location","lat")&&elements.exists("start_location","lng"))
            {
                LatLng positon=new LatLng(
                        (Double) elements.value("start_location","lat"),
                        (Double)elements.value("start_location","lng"));
                distanceMatrixData.pointons.add(positon);
            }
            if(elements.exists("status")){
                if(!elements.value("status").toString().equals("OK"))
                return null;
            }
            final OLPJsonParser.OLPJsonArrayContext steps= elements.createArrayContext("steps");
            for(int i=0;i<steps.length();i++)
            {
                steps.setIndex(i);
                if(steps.exists("end_location","lat")&&steps.exists("end_location","lng"))
                {
                    LatLng positon=new LatLng(Double.parseDouble(steps.value("end_location","lat").toString()),
                            Double.parseDouble(steps.value("end_location","lng").toString()));
                    distanceMatrixData.pointons.add(positon);
                }
            }
        } catch (JSONException e) {
            Log.e("Error Json parser to :",e.toString());
        }
        return distanceMatrixData;
    }
}
