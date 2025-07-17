import { Redirect } from 'expo-router';

// This will redirect to the tanks tab when someone navigates to /tank
export default function TankIndex() {
  return <Redirect href='/(tabs)/tanks' />;
}
