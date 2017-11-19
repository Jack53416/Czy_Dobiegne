package com.example.szymo.mobileapp.net;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.os.AsyncTask;
import android.support.annotation.NonNull;
import android.util.Log;

import com.example.szymo.mobileapp.R;
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
 * Created by szymo on 02.11.2017.
 */

public class ServerComunication  implements HostnameVerifier {

    private Context ctx;

    public ServerComunication(Context baseContext) {
        ctx = baseContext;
        setSSLceritfication();
    }

    @Override
    public boolean verify(String s, SSLSession sslSession) {
        return  true;
    }

    public enum RequestType{
        MARKER
    }
    public interface IOnResponseReceived {
        void OnResponseReceived(final int code, final String data);
    }
    public boolean send(@NonNull final RequestType type,final IOnResponseReceived callback){
       switch (type){
           case MARKER:
               new RequestDataFromServer().execute(new ServerRequestData(type,callback));
               return true;

       }
       return false;
    }

    @NonNull
    private HttpURLConnection createConnection(final String url, final String method) throws IOException {

        HttpsURLConnection c = (HttpsURLConnection) new URL(url).openConnection();
        c.setRequestMethod(method);
        c.setRequestProperty("Content-Type", "application/json");
        c.setRequestProperty("charset", "utf-8");
        c.setConnectTimeout(ctx.getResources().getInteger(R.integer.timeout_medium));
        c.setReadTimeout(ctx.getResources().getInteger(R.integer.timeout_medium));
        return c;

    }
    private ServerRequestData handleServerResponse(final ServerRequestData data, final HttpsURLConnection c) throws IOException {
        int responseCode = c.getResponseCode();
        data.setCode(responseCode);
        if (responseCode == 200) {
            data.mData = StringUtil.StreamToString(c.getInputStream());
            Log.v(String.valueOf(this), "Response OK: " + data.mData);
            return data;
        } else {
            Log.d(String.valueOf(this), "Response code: " + responseCode);
            return data;
        }
    }
    private static class ServerRequestData {
        private final RequestType mType;
        private final IOnResponseReceived mCallback;
        private final String[] mUrlVariables;
        private String mData;
        private int code = 0;

        public ServerRequestData(final RequestType type, final IOnResponseReceived callback, final String... urlVariables) {
            mType = type;
            mCallback = callback;
            mUrlVariables = urlVariables;
        }

        public int getCode() {
            return code;
        }

        public void setCode(final int code) {
            this.code = code;
        }
    }
    private class RequestDataFromServer extends AsyncTask<ServerRequestData,Void,ServerRequestData>{
        private RequestDataFromServer(){}

        @Override
        protected ServerRequestData doInBackground(ServerRequestData... serverRequestData) {
            final ServerRequestData data = serverRequestData[0];
            try{
            String serverUrl="https://35.165.124.185";
            String url=requestUrl(serverUrl,data.mType);
            HttpsURLConnection c = (HttpsURLConnection) createConnection(url, "GET");
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
        private String requestUrl(final String BaseUrl,final RequestType type){
            final int resId;
            switch (type){
                default:
                    return  null;
                case MARKER:
                    resId= R.string.HelloWorld;
                    break;
            }
            return ctx.getString(resId,BaseUrl);
        }
    }

    private void setSSLceritfication() {
        CertificateFactory cf = null;
        try {
            cf = CertificateFactory.getInstance("X.509");

// From https://www.washington.edu/itconnect/security/ca/load-der.crt
            AssetFileDescriptor fileDescriptor = ctx.getResources().openRawResourceFd(R.raw.cert);
//            FileInputStream fis=(FileInputStream)ctx.getResources().openRawResource(R.raw.cert);
            FileInputStream fis = fileDescriptor.createInputStream();
            InputStream caInput = new BufferedInputStream(fis);
            Certificate ca;
            try {
                ca = cf.generateCertificate(caInput);
                System.out.println("ca=" + ((X509Certificate) ca).getSubjectDN());
            } finally {
                caInput.close();
            }

// Create a KeyStore containing our trusted CAs
            String keyStoreType = KeyStore.getDefaultType();
            KeyStore keyStore = KeyStore.getInstance(keyStoreType);
            keyStore.load(null, null);
            keyStore.setCertificateEntry("ca", ca);

// Create a TrustManager that trusts the CAs in our KeyStore
            String tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
            tmf.init(keyStore);

// Create an SSLContext that uses our TrustManager
            SSLContext context = SSLContext.getInstance("TLS");
            context.init(null, tmf.getTrustManagers(), null);
            HttpsURLConnection.setDefaultSSLSocketFactory(context.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier(this);
        } catch (IOException e1) {
            e1.printStackTrace();
        } catch (CertificateException e1) {
            e1.printStackTrace();
        } catch (NoSuchAlgorithmException e1) {
            e1.printStackTrace();
        } catch (KeyStoreException e1) {
            e1.printStackTrace();
        } catch (KeyManagementException e1) {
            e1.printStackTrace();
        }
    }
}
