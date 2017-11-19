package com.example.szymo.mobileapp.data;

/**
 * Created by szymo on 16.11.2017.
 */

public class DistanceData {
    public Double orginLat;
    public Double orginLot;
    public Double destinationLat;
    public Double destinationLot;

    public DistanceData(Double oLat,Double oLot,Double dLat,Double dLot){
        orginLat=oLat;
        orginLot=oLot;
        destinationLat=dLat;
        destinationLot=dLot;
    }
}
