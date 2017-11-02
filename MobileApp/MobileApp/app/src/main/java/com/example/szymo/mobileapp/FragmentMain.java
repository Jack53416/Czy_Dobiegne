package com.example.szymo.mobileapp;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Criteria;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import android.location.LocationListener;

import com.example.szymo.mobileapp.net.ServerComunication;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONException;

import java.io.IOException;
import java.util.Date;
import java.util.List;

//import android.location.Location;


/**
 * Created by szymo on 25.10.2017.
 */

public class FragmentMain extends FragmentBase implements OnMapReadyCallback, LocationListener {

    private View mProgressBar;
    private MapView mMapView;
    private GoogleMap mMap;
    private Location mLocation;
    private LocationManager mLocationManager;
    private Marker myPosition;
    ServerComunication serverComunication;
    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);

        mLocationManager = (LocationManager) activity.getSystemService(Context.LOCATION_SERVICE);
    }

    @Override
    protected View createView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        Log.i(String.valueOf(this), "create view");
        final View inflated = inflater.inflate(R.layout.fragment_main, container, false);
        mProgressBar = inflated.findViewById(R.id.progress);
        mMapView = (MapView) inflated.findViewById(R.id.map);
        mMapView.onCreate(savedInstanceState);

        mMapView.onResume();
        //mMapView.onResume();
        try {
            MapsInitializer.initialize(getActivity().getApplicationContext());
        } catch (Exception e) {
            Log.e("Problem with map :", e.toString());
        }
        serverComunication=((ActivityMain)getActivity()).mServerComunication;
        serverComunication.send(ServerComunication.RequestType.MARKER,new OnServerDataResponseReceived());
        setLocation();
        mMapView.getMapAsync(this);
        return inflated;
    }

    private void setLocation() {
        if (ActivityCompat.checkSelfPermission(getActivity(), android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getActivity(), android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ((ActivityMain) getActivity()).goToPermissionActivity();
        }
        Criteria criteria = new Criteria();
        String provider = mLocationManager.getBestProvider(criteria, false);
        mLocation = mLocationManager.getLastKnownLocation(provider);

        mLocationManager.requestLocationUpdates(provider, 100, 1, this);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        if (ActivityCompat.checkSelfPermission(getActivity(), android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getActivity(), android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ((ActivityMain) getActivity()).goToPermissionActivity();
        }
        mMap.setMyLocationEnabled(true);
        setLocalizationOnMap();

    }

    private void setLocalizationOnMap() {
        if (mLocation != null) {
            LatLng position = new LatLng(mLocation.getLatitude(), mLocation.getLongitude());
            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(position, 15));
            mProgressBar.setVisibility(View.GONE);

            Geocoder geocoder=new Geocoder(getContext());
            List<Address> addresses;
            try {
                addresses=geocoder.getFromLocationName("Dobroń, kaczeńcowa 1",1);
                if(addresses.size() > 0){

                    mMap.addMarker(new MarkerOptions().position(new LatLng(addresses.get(0).getLatitude(),addresses.get(0).getLongitude()))).setTitle("test");
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (ActivityCompat.checkSelfPermission(getActivity(), android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getActivity(), android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ((ActivityMain) getActivity()).goToPermissionActivity();
        }
        mLocationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, this);
        mLocationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, this);
        mMapView.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        mLocationManager.removeUpdates(this);
        mMapView.onPause();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mMapView.onDestroy();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mMapView.onLowMemory();
    }

    @Override
    public void onLocationChanged(Location location) {
        mLocation = location;
        setLocalizationOnMap();
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {
        Log.i("onstatus Chaged", s);
    }

    @Override
    public void onProviderEnabled(String s) {
        Log.i("onstatus Chaged", s);
    }

    @Override
    public void onProviderDisabled(String s) {
        Log.i("onstatus Chaged", s);
    }

    private class OnServerDataResponseReceived implements ServerComunication.IOnResponseReceived    {
        @Override
        public void OnResponseReceived(final int code, final String data)
        {
           if(data!=null){

           }

        }
    }
}
