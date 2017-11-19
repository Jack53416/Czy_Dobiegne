package com.example.szymo.mobileapp.data;

import com.example.szymo.mobileapp.util.SharedPrefs;

/**
 * Created by szymo on 19.11.2017.
 */

public class AccountInfo {

    public String mUserId;
    public AccountInfo()
    {
    }

    /**
     * Restore account info object from saved data in shared preferences
     * @param prefs Application shared preferences
     */
    public AccountInfo(final SharedPrefs prefs)
    { mUserId = prefs.Load(SharedPrefs.TOKEN, null);}
    public void save(final SharedPrefs prefs)
    {
        prefs.Save(SharedPrefs.TOKEN, mUserId);
    }
    public void clear(final SharedPrefs prefs)
    {
        prefs.Clear(SharedPrefs.TOKEN);
        mUserId=null;
    }
}
