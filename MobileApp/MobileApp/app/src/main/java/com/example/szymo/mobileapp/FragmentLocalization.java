package com.example.szymo.mobileapp;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.szymo.mobileapp.net.ServerComunication;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

/**
 * Created by szymo on 30.12.2017.
 */

public class FragmentLocalization extends FragmentBase implements LocationListener {

    EditText mName;
    EditText mCountry;
    EditText mCity;
    EditText mStreet;
    EditText mLon;
    EditText mLat;
    EditText mPriceMin;
    EditText mPriceMax;
    EditText mDestination;
    LocationManager mLocationManager;
    Location mLocation;
    private View mProgress;
    private ServerComunication serverComunication;
    Button send;

    @Override
    protected View createView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        final View inflated = inflater.inflate(R.layout.fragment_localization, container, false);

        mName = (EditText) inflated.findViewById(R.id.name);
        mCountry = (EditText) inflated.findViewById(R.id.country);
        mCity = (EditText) inflated.findViewById(R.id.city);
        mStreet = (EditText) inflated.findViewById(R.id.street);
        mLon = (EditText) inflated.findViewById(R.id.lon);
        mLat = (EditText) inflated.findViewById(R.id.lat);
        mPriceMin = (EditText) inflated.findViewById(R.id.price_min);
        mPriceMax = (EditText) inflated.findViewById(R.id.price_min);
        mDestination = (EditText) inflated.findViewById(R.id.description);
        mProgress = inflated.findViewById(R.id.login_progress);
        serverComunication = ((ActivityMain) getContext()).mServerComunication;
        send = (Button) inflated.findViewById(R.id.login_button);
        send.setOnClickListener(buttonLoginEvent);
        init();
        return inflated;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);

        mLocationManager = (LocationManager) activity.getSystemService(Context.LOCATION_SERVICE);
    }

    private void init() {

        if (ActivityCompat.checkSelfPermission(getContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getContext(), android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

            return;
        }
        mLocationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, this);

    }

    private Address georadar(Location loc) {
        Geocoder geocoder;
        List<Address> address;
        geocoder = new Geocoder(getContext(), Locale.getDefault());
        try {
            address = geocoder.getFromLocation(loc.getLatitude(), loc.getLongitude(), 1);
            mCountry.setText(address.get(0).getCountryName());
            mCity.setText(address.get(0).getLocality());
            mStreet.setText(address.get(0).getAddressLine(0));
            mLat.setText(String.valueOf(loc.getLatitude()));
            mLon.setText(String.valueOf(loc.getLongitude()));

            mProgress.setVisibility(View.GONE);
            return address.get(0);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public void onLocationChanged(Location location) {
        if (mLocation == null) {
            mLocation = location;
            georadar(location);
        }
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public void onProviderEnabled(String provider) {

    }

    @Override
    public void onProviderDisabled(String provider) {

    }


    View.OnClickListener buttonLoginEvent = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            mProgress.setVisibility(View.VISIBLE);
            String name = mName.getText().toString();
            String country = mCountry.getText().toString();
            String city = mCity.getText().toString();
            String street = mStreet.getText().toString();
            String lon = mLon.getText().toString();
            String lat = mLat.getText().toString();
            String min = mPriceMin.getText().toString();
            String max = mPriceMax.getText().toString();
            String des = mDestination.getText().toString();
            serverComunication.send(ServerComunication.RequestType.ADDLOCALIZATION, new OnServerDataResponseReceived(), name, country, city, street, lon, lat, min, max, des);
        }
    };

    private class OnServerDataResponseReceived implements ServerComunication.IOnResponseReceived {
        @Override
        public void OnResponseReceived(final int code, final String data) {
            if (data != null) {

            } else {
                Toast.makeText(getContext(), R.string.login_uncorrect, Toast.LENGTH_LONG).show();
            }
            mProgress.setVisibility(View.GONE);
        }
    }
}
