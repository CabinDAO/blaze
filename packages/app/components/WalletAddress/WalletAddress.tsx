import { useMemo } from "react";

import { styled } from "@/stitches.config";

const AddressText = styled("span", {
  fontFamily: "$mono",
});

export interface WalletAddressProps
  extends React.ComponentProps<typeof AddressText> {
  address: string;
}
const WalletAddress = ({ address, ...props }: WalletAddressProps) => {
  const addr = useMemo(() => {
    return [address.slice(0, 6), address.slice(-4)].join("...");
  }, [address]);

  return (
    <AddressText title={address} {...props}>
      {addr}
    </AddressText>
  );
};

export default WalletAddress;
