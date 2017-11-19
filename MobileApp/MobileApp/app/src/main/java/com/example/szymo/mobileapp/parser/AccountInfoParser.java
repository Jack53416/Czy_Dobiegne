package com.example.szymo.mobileapp.parser;

import android.support.annotation.NonNull;

import com.example.szymo.mobileapp.data.AccountInfo;

import org.json.JSONException;

/**
 * Created by szymo on 19.11.2017.
 */

public class AccountInfoParser {
    public AccountInfo parse(final String response) throws JSONException
    {
        try
        {
            final AccountInfo info = new AccountInfo();
            final OLPJsonParser p = new OLPJsonParser();
            final OLPJsonParser.OLPJsonContext ctx = p.parse(response);
            info.mUserId = ctx.value("token");

            return info;
        }
        catch (final Exception ex)
        {
            throw new JSONException("Could not parse data");
        }
    }
}
