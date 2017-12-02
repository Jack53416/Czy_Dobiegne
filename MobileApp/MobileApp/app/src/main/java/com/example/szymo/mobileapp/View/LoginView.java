package com.example.szymo.mobileapp.View;

import android.content.Context;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.example.szymo.mobileapp.ActivityMain;
import com.example.szymo.mobileapp.R;
import com.example.szymo.mobileapp.net.ServerComunication;
import com.example.szymo.mobileapp.parser.AccountInfoParser;

import org.json.JSONException;

/**
 * Created by szymo on 01.12.2017.
 */

public class LoginView extends LinearLayout {

    private ProgressBar login_progress;
    private EditText login_input;
    private ImageView login_input_clear;
    private EditText password_input;
    private ImageView password_input_clear;
    private Button login_button;
   private  ServerComunication serverComunication;
    private Context ctx;
    public LoginView(Context context) {
        super(context);
        ctx=context;
        init();
    }


    private void init() {
        final LayoutInflater inf = LayoutInflater.from(getContext());
        final View inflated = inf.inflate(R.layout.view_login, this, false);

        login_progress = (ProgressBar) inflated.findViewById(R.id.login_progress);
        login_input = (EditText) inflated.findViewById(R.id.login_input);
        login_input_clear = (ImageView) inflated.findViewById(R.id.login_input_clear);
        password_input = (EditText) inflated.findViewById(R.id.password_input);
        password_input_clear = (ImageView) inflated.findViewById(R.id.password_input_clear);
        login_button = (Button) inflated.findViewById(R.id.login_button);

        login_progress.setVisibility(GONE);
        login_input.addTextChangedListener(addLoginInput);
        login_input_clear.setOnClickListener(clearEditText(login_input));
        password_input.addTextChangedListener(addPasswordInput);
        password_input_clear.setOnClickListener(clearEditText(password_input));
        login_button.setOnClickListener(buttonLoginEvent);

        serverComunication=((ActivityMain)ctx).mServerComunication;
        addView(inflated);
    }

    private boolean isStringEmpty(String s) {
        if (s.equals("") || s.isEmpty() || s.length() == 0)
            return true;
        else
            return false;
    }

    TextWatcher addLoginInput = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {

        }

        @Override
        public void afterTextChanged(Editable s) {
            if (isStringEmpty(s.toString())) {
                login_input_clear.setVisibility(View.GONE);
                login_button.setVisibility(View.GONE);
            } else if (!isStringEmpty(s.toString())) {
                login_input_clear.setVisibility(View.VISIBLE);
                if (!isStringEmpty(password_input.getText().toString()))
                    login_button.setVisibility(View.VISIBLE);
            }

        }
    };
    TextWatcher addPasswordInput = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {

        }

        @Override
        public void afterTextChanged(Editable s) {
            if (isStringEmpty(s.toString())) {
                password_input_clear.setVisibility(View.GONE);
                login_button.setVisibility(View.GONE);
            } else if (!isStringEmpty(s.toString())) {
                password_input_clear.setVisibility(View.VISIBLE);
                if (!isStringEmpty(login_input.getText().toString()))
                    login_button.setVisibility(View.VISIBLE);
            }

        }
    };

    private View.OnClickListener clearEditText(final EditText editText) {
        return new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                editText.getText().clear();
            }
        };
    }

    OnClickListener buttonLoginEvent = new OnClickListener() {
        @Override
        public void onClick(View v) {
            login_progress.setVisibility(VISIBLE);
            final String login=login_input.getText().toString();
            final String password=password_input.getText().toString();
            serverComunication.send(ServerComunication.RequestType.LOGIN,new OnServerDataResponseReceived(),login,password);
        }
    };

    private class OnServerDataResponseReceived implements ServerComunication.IOnResponseReceived {
        @Override
        public void OnResponseReceived(final int code, final String data) {
            if (data != null) {
//                try {
//                    mAccountInfo=new AccountInfoParser().parse(data);
//                    serverComunication.setToken(mAccountInfo.mUserId);
//                    mAccountInfo.save(mPrefs);
//                    onAccountInfoChanged();
//                } catch (JSONException e) {
//                    e.printStackTrace();
//                }
                Toast.makeText(getContext(), R.string.login_correct, Toast.LENGTH_LONG).show();
            }
login_progress.setVisibility(GONE);
        }
    }
}