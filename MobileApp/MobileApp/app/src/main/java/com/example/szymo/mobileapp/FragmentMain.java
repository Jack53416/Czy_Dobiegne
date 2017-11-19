package com.example.szymo.mobileapp;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.example.szymo.mobileapp.data.AccountInfo;
import com.example.szymo.mobileapp.data.DistanceData;
import com.example.szymo.mobileapp.data.DistanceMatrixData;
import com.example.szymo.mobileapp.data.WCData;
import com.example.szymo.mobileapp.net.GoogleComunication;
import com.example.szymo.mobileapp.net.ServerComunication;
import com.example.szymo.mobileapp.parser.DistanceMatrixParser;
import com.example.szymo.mobileapp.parser.WcParser;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.nearby.messages.Distance;

import org.json.JSONException;

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
    CameraUpdate zoom;
    ImageButton zoom_in;
    ImageButton zoom_out;
    ImageButton centerlocalization;
    LinearLayout information;
    ImageView create_down;
    TextView time;
    TextView distance;
    private int zoom_value = 15;
    GoogleComunication googleComunication;
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
        zoom_in = (ImageButton) inflated.findViewById(R.id.zoom_in);
        zoom_in.setOnClickListener(zoomIn);
        zoom_out = (ImageButton) inflated.findViewById(R.id.zoom_out);
        zoom_out.setOnClickListener(zoomOut);
        centerlocalization=(ImageButton)inflated.findViewById(R.id.center_localization);
        centerlocalization.setOnClickListener(cetrumSet);
        create_down=(ImageView)inflated.findViewById(R.id.carete_down);
        create_down.setOnClickListener(information_gone);
        time=(TextView)inflated.findViewById(R.id.text_time);
        distance=(TextView)inflated.findViewById(R.id.text_distance);
        information=(LinearLayout)inflated.findViewById(R.id.information);
        mMapView.onResume();
        try {
            MapsInitializer.initialize(getActivity().getApplicationContext());
        } catch (Exception e) {
            Log.e("Problem with map :", e.toString());
        }
        serverComunication = ((ActivityMain) getActivity()).mServerComunication;
        googleComunication=((ActivityMain)getActivity()).mgoogleComunication;
        serverComunication.send(ServerComunication.RequestType.MARKER, new OnServerDataResponseReceived());

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

        mLocationManager.requestLocationUpdates(provider, 0, 0, this);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        mMap.getUiSettings().setMapToolbarEnabled(false);
        mMap.getUiSettings().setMyLocationButtonEnabled(false);
        mMap.getUiSettings().setCompassEnabled(false);
        mMap.setOnMarkerClickListener(markerClickListener);
        if (ActivityCompat.checkSelfPermission(getActivity(), android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getActivity(), android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ((ActivityMain) getActivity()).goToPermissionActivity();
        }
        mMap.setMyLocationEnabled(true);
        if (mMap.getMyLocation() != null) {
            Log.i(mMap.getMyLocation().toString(), "");
        }


    }

    GoogleMap.OnMarkerClickListener markerClickListener=new GoogleMap.OnMarkerClickListener() {
        @Override
        public boolean onMarkerClick(Marker marker) {
            if(marker!= null){
                LatLng latLng=marker.getPosition();
                DistanceData distanceData=new DistanceData(mLocation.getLatitude(),mLocation.getLongitude(),latLng.latitude,latLng.longitude);
                googleComunication.send(GoogleComunication.RequestType.DISTANSE,new OnGoogleDataResponseReceived(),distanceData);
                mProgressBar.setVisibility(View.VISIBLE);
                return true;
            }
            return false;
        }
    };

    private void setLocalizationOnMap() {
        if (mLocation != null) {
            LatLng position = new LatLng(mLocation.getLatitude(), mLocation.getLongitude());
            if (zoom == null) {
                zoom = CameraUpdateFactory.newLatLngZoom(position, zoom_value);
                mMap.animateCamera(zoom);
            }
            mProgressBar.setVisibility(View.GONE);

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

    private class OnServerDataResponseReceived implements ServerComunication.IOnResponseReceived {
        @Override
        public void OnResponseReceived(final int code, final String data) {
            if (data != null) {
                try {
                    List<WCData> listWC = new WcParser().parser(data);
                    LatLngBounds curScreen = mMap.getProjection().getVisibleRegion().latLngBounds;
                    mMap.addMarker(new MarkerOptions().position(new LatLng(curScreen.southwest.latitude, curScreen.southwest.longitude)));
                    mMap.addMarker(new MarkerOptions().position(new LatLng(curScreen.northeast.latitude, curScreen.northeast.longitude)));
                    if (listWC != null) {
                        for (int i = 0; i < listWC.size(); i++) {
                            mMap.addMarker(new MarkerOptions().position(new LatLng(listWC.get(i).Latitude, listWC.get(i).Longitude))).setTitle(listWC.get(i).name);
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

        }
    }
    private class OnGoogleDataResponseReceived implements GoogleComunication.IOnResponseReceived {
        @Override
        public void OnResponseReceived(final int code, final String data) {
            if (data != null) {

                DistanceMatrixData distanceMatrixData=new  DistanceMatrixParser().parser(data);
                if(distanceMatrixData!=null){
                time.setText(distanceMatrixData.Time);
                distance.setText(distanceMatrixData.Distance);
                information.setVisibility(View.VISIBLE);}
                else{
                    information.setVisibility(View.GONE);
                    Toast.makeText(getContext(),"Nie można obliczyć dystansu do celu",Toast.LENGTH_LONG).show();
                }
            }

            mProgressBar.setVisibility(View.GONE);
        }
    }

    View.OnClickListener zoomIn = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            mMap.animateCamera(CameraUpdateFactory.zoomIn());
        }
    };

    View.OnClickListener zoomOut = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            mMap.animateCamera(CameraUpdateFactory.zoomOut());
        }
    };
    View.OnClickListener cetrumSet=new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            LatLng latLng = new LatLng(mLocation.getLatitude(), mLocation.getLongitude());
            CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(latLng, zoom_value);
            mMap.animateCamera(cameraUpdate);
        }
    };
    View.OnClickListener information_gone=new View.OnClickListener() {
        @Override
        public void onClick(View view) {
      information.setVisibility(View.GONE);
        }
    };
}
