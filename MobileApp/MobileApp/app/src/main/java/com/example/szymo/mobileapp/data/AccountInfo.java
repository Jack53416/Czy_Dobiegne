package com.example.szymo.mobileapp.data;

import com.example.szymo.mobileapp.util.SharedPrefs;

/**
 * Created by szymo on 19.11.2017.
 */

public class AccountInfo {

    public String mUserId;
    public String mUserName;
    public AccountInfo()
    {
    }

    /**
     * Restore account info object from saved data in shared preferences
     * @param prefs Application shared preferences
     */
    public AccountInfo(final SharedPrefs prefs)
    {
        mUserId = prefs.Load(SharedPrefs.TOKEN, null);
        mUserName = prefs.Load(SharedPrefs.NAME, null);
    }
    public void save(final SharedPrefs prefs)

    {
        prefs.Save(SharedPrefs.TOKEN, mUserId);
        prefs.Save(SharedPrefs.NAME, mUserName);
    }
    public void clear(final SharedPrefs prefs)
    {
        prefs.Clear(SharedPrefs.TOKEN);
        prefs.Clear(SharedPrefs.NAME);
        mUserName=null;
        mUserId=null;
    }
    public boolean isValid()
    {
        return mUserId != null;  // TODO?
    }
}
