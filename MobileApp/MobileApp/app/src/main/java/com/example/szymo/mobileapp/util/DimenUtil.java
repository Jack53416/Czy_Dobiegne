package com.example.szymo.mobileapp.util;

import android.content.res.Resources;
import android.util.DisplayMetrics;
import android.util.TypedValue;

/**
 * Created by szymo on 22.10.2017.
 */


public final class DimenUtil
{
    private static final DimenUtil INSTANCE = new DimenUtil();

    private DimenUtil()
    {
    }

    public static DimenUtil Me()
    {
        return INSTANCE;
    }

    public static float ConvertDpToPixels(final DisplayMetrics dm, final float dp)
    {
        return TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, dm);
    }

    public static float ConvertDpToPixels(final Resources res, final float dp)
    {
        return TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, res.getDisplayMetrics());
    }

    public static float ConvertSpToPixels(final Resources res, final float sp)
    {
        return sp * res.getDisplayMetrics().scaledDensity;
    }

}

