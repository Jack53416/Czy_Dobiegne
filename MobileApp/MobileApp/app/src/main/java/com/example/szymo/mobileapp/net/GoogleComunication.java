package com.example.szymo.mobileapp.net;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.util.Log;

import com.example.szymo.mobileapp.R;
import com.example.szymo.mobileapp.data.DistanceData;
import com.example.szymo.mobileapp.util.StringUtil;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManagerFactory;

/**
 * Created by szymo on 16.11.2017.
 */

public class GoogleComunication implements HostnameVerifier {

    private Context ctx;

    public GoogleComunication(Context baceContext) {
        ctx = baceContext;

    }

    @Override
    public boolean verify(String s, SSLSession sslSession) {
        return true;
    }

    public enum RequestType {
        DISTANSE,
        RUTE
    }

    public interface IOnResponseReceived {
        void OnResponseReceived(final int code, final String data);
    }

    public boolean send(@NonNull final RequestType type, final IOnResponseReceived callback, final DistanceData data) {
        switch (type) {
            case DISTANSE:
                new RequestDataFromServerGoogle().execute(new ServerRequestData(type, callback, data));
                return true;

        }
        return false;
    }

    private ServerRequestData handleServerResponse(final ServerRequestData data, final HttpURLConnection c) throws IOException {
        int responseCode = c.getResponseCode();
        data.setCode(responseCode);
        if (responseCode == 200) {
            data.mData = StringUtil.StreamToString(c.getInputStream());
            Log.v(String.valueOf(this), "Response OK: "+responseCode);
            return data;
        } else {
            Log.d(String.valueOf(this), "Response code: " + responseCode);
            return data;
        }
    }

    private static class ServerRequestData {
        private final RequestType mType;
        private final IOnResponseReceived mCallback;
        private final DistanceData mDistanceData;
        private String mData;
        private int code = 0;

        public ServerRequestData(final RequestType type, final IOnResponseReceived callback, final DistanceData distanceData) {
            mType = type;
            mCallback = callback;
            mDistanceData = distanceData;
        }

        public int getCode() {
            return code;
        }

        public void setCode(final int code) {
            this.code = code;
        }
    }

    private class RequestDataFromServerGoogle extends AsyncTask<ServerRequestData, Void, ServerRequestData> {
        private RequestDataFromServerGoogle() {
        }

        @Override
        protected ServerRequestData doInBackground(ServerRequestData... serverRequestData) {
            final ServerRequestData data = serverRequestData[0];
            try {


                String url = requestUrl(null, data.mType, data.mDistanceData.orginLat, data.mDistanceData.orginLot,
                        data.mDistanceData.destinationLat, data.mDistanceData.destinationLot);
                HttpURLConnection c = (HttpURLConnection) createConnection(url, "GET");
                return handleServerResponse(data, c);
            } catch (Exception e) {
                Log.e(String.valueOf(this), "exception during sending command to ESH", e);
            }
            return data;
        }

        @Override
        protected void onPostExecute(final ServerRequestData data) {
            if (data != null && data.mCallback != null) {
                data.mCallback.OnResponseReceived(data.getCode(), data.mData);
            }
        }

        private String requestUrl(final String BaseUrl, final RequestType type, final Double... var) {
            final int resId;
            switch (type) {
                default:
                    return null;
                case DISTANSE:
                    resId = R.string.GoooleDistance;
                    return ctx.getString(resId, var[0], var[1], var[2], var[3]);

            }

        }
    }

    @NonNull
    private HttpURLConnection createConnection(final String url, final String method) throws IOException {

        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setRequestMethod(method);
        //c.setSSLSocketFactory(setSSLceritfication().getSocketFactory());
        c.setRequestProperty("Content-Type", "application/json");
        c.setRequestProperty("charset", "utf-8");
        c.setConnectTimeout(ctx.getResources().getInteger(R.integer.timeout_medium));
        c.setReadTimeout(ctx.getResources().getInteger(R.integer.timeout_medium));
        return c;

    }

}
