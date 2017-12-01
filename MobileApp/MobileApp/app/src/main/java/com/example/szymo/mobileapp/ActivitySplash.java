package com.example.szymo.mobileapp;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.app.ActivityCompat;

import com.crashlytics.android.Crashlytics;

import io.fabric.sdk.android.Fabric;

import static java.lang.Thread.MAX_PRIORITY;
import static java.lang.Thread.sleep;

/**
 * Created by szymo on 15.10.2017.
 */

public class ActivitySplash extends ActivityBase {
    private static final long SLEEP_TIME = 1000L;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        Fabric.with(this, new Crashlytics());

        setContentView(R.layout.activity_splash);

        new WaitingThread().start();
    }

    private class WaitingThread extends Thread {
        @Override
        public void run() {
            try {
                sleep(SLEEP_TIME);
            } catch (final InterruptedException ignored) {
            }

            // TODO needs to handle homescreen key etc
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    startMainApp();
                }
            });
        }
    }

    private void startMainApp() {
        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE,Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_NETWORK_STATE}, 1);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[], int[] grantResults) {

        switch (requestCode) {
            case 1:
                 {

                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    Intent intent = new Intent(this, ActivityMain.class);
                    startActivity(intent);
                    finish();

                } else {
                    Intent intent = new Intent(this, ActivityPermissions.class);
                    startActivity(intent);
                    finish();
                }
                return;
            }

        }
    }

    @Override
    public void onBackPressed() {
        moveTaskToBack(true);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

}
