package com.example.szymo.mobileapp;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.Window;
import android.view.WindowManager;

import static java.lang.Thread.sleep;

/**
 * Created by szymo on 15.10.2017.
 */

public class ActivitySplash extends ActivityBase {
    private static final long SLEEP_TIME = 1000L;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_splash);

        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, 1);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[], int[] grantResults) {
        try
        {
            sleep(SLEEP_TIME);
        }
        catch (final InterruptedException ignored)
        {
        }
        switch (requestCode) {
            case 1: {

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
    public  void onDestroy()
    {
        super.onDestroy();
    }

}
