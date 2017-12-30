package com.example.szymo.mobileapp.View;

import android.content.Context;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Patterns;
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

/**
 * Created by szymo on 30.12.2017.
 */

public class EditView extends LinearLayout {
    private ProgressBar login_progress;
    private EditText login_input;
    private ImageView login_input_clear;
    private EditText password_input;
    private ImageView password_input_clear;
    private EditText email_input;
    private ImageView email_input_clear;
    private Button login_button;

    private ServerComunication serverComunication;
    private Context ctx;

    public EditView(Context context) {
        super(context);
        ctx = context;
        init();
    }

    private void init() {
        final LayoutInflater inf = LayoutInflater.from(getContext());
        final View inflated = inf.inflate(R.layout.view_edit, this, false);
        login_progress = (ProgressBar) inflated.findViewById(R.id.login_progress);
        login_input = (EditText) inflated.findViewById(R.id.login_input);
        login_input_clear = (ImageView) inflated.findViewById(R.id.login_input_clear);
        password_input = (EditText) inflated.findViewById(R.id.password_input);
        password_input_clear = (ImageView) inflated.findViewById(R.id.password_input_clear);
        email_input = (EditText) inflated.findViewById(R.id.email_input);
        email_input_clear = (ImageView) inflated.findViewById(R.id.email_input_clear);
        login_button = (Button) inflated.findViewById(R.id.login_button);

        login_progress.setVisibility(GONE);
        login_input_clear.setOnClickListener(clearEditText(login_input));
        password_input_clear.setOnClickListener(clearEditText(password_input));
        email_input_clear.setOnClickListener(clearEditText(email_input));
        login_button.setOnClickListener(buttonLoginEvent);
        login_button.setVisibility(VISIBLE);

        serverComunication = ((ActivityMain) ctx).mServerComunication;
        addView(inflated);
    }


    private View.OnClickListener clearEditText(final EditText editText) {
        return new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                editText.getText().clear();
            }
        };
    }

    View.OnClickListener buttonLoginEvent = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            login_progress.setVisibility(VISIBLE);
            EditAction();
        }
    };

    private boolean isEmailValid() {

        if (Patterns.EMAIL_ADDRESS.matcher(email_input.getText().toString()).matches()) {
            return true;
        } else {
            Toast.makeText(getContext(), R.string.login_error_login_input, Toast.LENGTH_LONG).show();
            login_progress.setVisibility(GONE);
            return false;
        }
    }



    private void EditAction() {
        final String login = login_input.getText().toString();
        final String password = password_input.getText().toString();
        final String email = email_input.getText().toString();
        if(login.equals("")&&password.equals("")&&email.equals("")){
            Toast.makeText(getContext(), R.string.edit_const, Toast.LENGTH_LONG).show();
            login_progress.setVisibility(GONE);
        }else{
            if(!email.equals(""))
            {
                if(isEmailValid()){
                    serverComunication.send(ServerComunication.RequestType.EDIT, new OnServerDataResponseReceived(), login, email, password);
                }

            }else{
                serverComunication.send(ServerComunication.RequestType.EDIT, new OnServerDataResponseReceived(), login, email, password);
            }

        }
    }

    private class OnServerDataResponseReceived implements ServerComunication.IOnResponseReceived {
        @Override
        public void OnResponseReceived(final int code, final String data) {
            if (data != null) {

                Toast.makeText(getContext(), R.string.edit_correct, Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(getContext(), R.string.edit_uncorrect, Toast.LENGTH_LONG).show();
            }
            login_progress.setVisibility(GONE);
        }
    }
}
