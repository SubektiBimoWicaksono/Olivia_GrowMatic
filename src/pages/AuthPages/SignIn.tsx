import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Growmatic Login | Smart Mushroom Farm Monitoring"
        description="Secure login to your Growmatic dashboard. Track and optimize your mushroom farm's environmental conditions with our IoT sensors and analytics platform."
        // keywords="mushroom farming, IoT monitoring, growmatic login, mushroom cultivation, farm dashboard, humidity monitoring, temperature tracking"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
