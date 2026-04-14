import {PermissionsAndroid, Platform} from 'react-native';

type BluetoothPermissionOptions = {
  connect?: boolean;
  scan?: boolean;
  title: string;
  message: string;
};

export async function requestBluetoothPermissions({
  connect = false,
  scan = false,
  title,
  message,
}: BluetoothPermissionOptions) {
  if (Platform.OS !== 'android') {
    return true;
  }

  const permissions =
    Platform.Version >= 31
      ? [
          ...(scan ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] : []),
          ...(connect ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] : []),
        ]
      : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

  if (!permissions.length) {
    return true;
  }

  for (const permission of permissions) {
    const result = await PermissionsAndroid.request(permission, {
      title,
      message,
      buttonNeutral: 'Preguntarme luego',
      buttonNegative: 'Cancelar',
      buttonPositive: 'OK',
    });

    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      return false;
    }
  }

  return true;
}
