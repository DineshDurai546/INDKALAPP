import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.indkal.workscan',
  appName: 'INDKAL',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    BarcodeScanner: {
      // Configuration options if needed
    },
  },
};

export default config;
