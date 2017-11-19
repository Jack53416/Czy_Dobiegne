package com.example.szymo.mobileapp.parser;

import android.util.Log;

import com.example.szymo.mobileapp.data.DistanceMatrixData;

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
            final OLPJsonParser.OLPJsonArrayContext rows = ctx.createArrayContext("rows");
            rows.setIndex(0);
            final OLPJsonParser.OLPJsonArrayContext elements = rows.createArrayContext("elements");
            elements.setIndex(0);
           if(elements.exists("distance","text")){
               distanceMatrixData.Distance=elements.value("distance","text").toString();
           }
            if(elements.exists("duration","text")){
                distanceMatrixData.Time=elements.value("duration","text").toString();
            }
            if(elements.exists("status")){
                if(!elements.value("status").toString().equals("OK"))
                return null;
            }
        } catch (JSONException e) {
            Log.e("Error Json parser to :",e.toString());
        }
        return distanceMatrixData;
    }
}
