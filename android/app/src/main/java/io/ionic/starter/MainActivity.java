package io.ionic.starter;

import android.os.Bundle;

import com.dutchconcepts.capacitor.barcodescanner.BarcodeScanner;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {



    @Override
    public void onCreate(Bundle saveInstanceState)
    {
        super.onCreate(saveInstanceState);

        //
//      this.init(
//        savedInstanceState,
//        new ArrayList<Class<? extends Plugin>>() {
//          {
//            // Additional plugins you've installed go here
//            // Ex: add(TotallyAw0esomePlugin.class);
//            add(BarcodeScanner.class);
//          }
//        }
//      );
    }
}
