package com.example.szymo.mobileapp.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.annotation.NonNull;
import android.util.Log;

/**
 * Created by szymo on 19.11.2017.
 */

public class SharedPrefs {
    public static final String TOKEN="token";
    private static final String PREFS = "czy_dobiegne_prefs";
    private final SharedPreferences mPrefs;
    public SharedPrefs(final Context ctx)
    {
        mPrefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
    private boolean PrefsValid()
    {
        if (mPrefs == null)
        {
            Log.e(String.valueOf(this), "Invalid preferences!");
        }

        return mPrefs != null;
    }

    public String Load(final String key, final String defaultValue)
    {
        if (PrefsValid())
        {
            final String value = mPrefs.getString(key, defaultValue);
            Log.v(String.valueOf(this), "[Prefs loading] " + key + " => " + value);
            return value;
        }
        return defaultValue;
    }

    public boolean Load(final String key, final boolean defaultValue)
    {
        if (PrefsValid())
        {
            final boolean value = mPrefs.getBoolean(key, defaultValue);
            Log.v(String.valueOf(this), "[Prefs loading] " + key + " => " + value);
            return value;
        }
        return defaultValue;
    }

    public int Load(final String key, final int defaultValue)
    {
        if (PrefsValid())
        {
            final int value = mPrefs.getInt(key, defaultValue);
            Log.v(String.valueOf(this), "[Prefs loading] " + key + " => " + value);
            return value;
        }
        return defaultValue;
    }

    public long Load(final String key, final long defaultValue)
    {
        if (PrefsValid())
        {
            final long value = mPrefs.getLong(key, defaultValue);
            Log.v(String.valueOf(this), "[Prefs loading] " + key + " => " + value);
            return value;
        }
        return defaultValue;
    }

    public <T extends Enum<T>> T LoadEnum(final String key, @NonNull final T defaultValue)
    {
        if (PrefsValid())
        {
            final int value = mPrefs.getInt(key, -1);
            if (value < 0)
            {
                return defaultValue;
            }

            try
            {
                return (T) defaultValue.getClass().getEnumConstants()[value];
            }
            catch (final Exception ex)
            {
                Log.w(String.valueOf(this), "Could not load enum from key: " + key, ex);
            }
        }
        return defaultValue;
    }

    public void Save(final String key, final String value)
    {
        if (PrefsValid())
        {
            Log.v(String.valueOf(this), "[Prefs saving] " + key + " => " + value);
            final SharedPreferences.Editor spe = mPrefs.edit();
            spe.putString(key, value);
            spe.apply();
        }
    }

    public void Save(final String key, final boolean value)
    {
        if (PrefsValid())
        {
            Log.v(String.valueOf(this), "[Prefs saving] " + key + " => " + value);
            final SharedPreferences.Editor spe = mPrefs.edit();
            spe.putBoolean(key, value);
            spe.apply();
        }
    }

    public void Save(final String key, final int value)
    {
        if (PrefsValid())
        {
            Log.v(String.valueOf(this), "[Prefs saving] " + key + " => " + value);
            final SharedPreferences.Editor spe = mPrefs.edit();
            spe.putInt(key, value);
            spe.apply();
        }
    }

    public void Save(final String key, final long value)
    {
        if (PrefsValid())
        {
            Log.v(String.valueOf(this), "[Prefs saving] " + key + " => " + value);
            final SharedPreferences.Editor spe = mPrefs.edit();
            spe.putLong(key, value);
            spe.apply();
        }
    }

    public <T extends Enum<T>> void SaveEnum(final String key, @NonNull final T value)
    {
        if (PrefsValid())
        {
            Log.v(String.valueOf(this), "[Prefs saving] " + key + " => " + value);
            final SharedPreferences.Editor spe = mPrefs.edit();
            spe.putInt(key, value.ordinal());
            spe.apply();
        }
    }

    public void Clear()
    {
        if (PrefsValid())
        {
            mPrefs.edit().clear().apply();
            Log.v(String.valueOf(this), "[Prefs cleared]");
        }
    }

    public void Clear(final String key)
    {
        if (PrefsValid())
        {
            mPrefs.edit().remove(key).apply();
            Log.v(String.valueOf(this), "[Prefs clearing] " + key);
        }
    }
}
