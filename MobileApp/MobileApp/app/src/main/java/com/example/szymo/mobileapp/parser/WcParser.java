package com.example.szymo.mobileapp.parser;

import com.example.szymo.mobileapp.data.WCData;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by szymo on 02.11.2017.
 */

public class WcParser {

    public List<WCData> parser(final String data)throws JSONException{
        final List<WCData> response=new ArrayList<>();
        final OLPJsonParser p=new OLPJsonParser();
        final OLPJsonParser.OLPJsonContext ctx=p.parse(data);
        final OLPJsonParser.OLPJsonArrayContext arrCtx = ctx.createArrayContext("data");
        for (int j = 0; j < arrCtx.length(); j++) {
            arrCtx.setIndex(j);
            WCData wc=new WCData();
                    wc.name=arrCtx.value("name");
                    wc.Latitude=arrCtx.value("latitude");
                    wc.Longitude=arrCtx.value("longitude");
                    response.add(wc);
        }
        return response;
    }
}
