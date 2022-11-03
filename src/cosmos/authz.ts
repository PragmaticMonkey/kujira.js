import { AminoConverters } from "@cosmjs/stargate";
import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz";
import { MsgGrant } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { Timestamp } from "cosmjs-types/google/protobuf/timestamp";

export interface AminoMsgGrant {
  /** Bech32 account address */
  readonly granter: string;
  /** Bech32 account address */
  readonly grantee: string;

  readonly grant: {
    authorization: string;
    expiration: string;
  };
}

export function createAuthzAminoConverters(): AminoConverters {
  return {
    "/cosmos.authz.v1beta1.MsgGrant": {
      aminoType: "cosmos-sdk/MsgGrant",
      toAmino: ({ granter, grantee, grant }: MsgGrant): AminoMsgGrant => ({
        grantee: grantee,
        granter: granter,
        grant: {
          authorization: GenericAuthorization.decode(
            grant?.authorization?.value || new Uint8Array()
          ).msg,
          expiration: new Date(
            grant?.expiration?.seconds.toNumber() || 0
          ).toISOString(),
        },
      }),
      fromAmino: ({ granter, grantee, grant }: AminoMsgGrant): MsgGrant =>
        MsgGrant.fromPartial({
          grantee: grantee,
          granter: granter,
          grant: {
            authorization: {
              typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
              value: GenericAuthorization.encode(
                GenericAuthorization.fromPartial({
                  msg: "/cosmos.staking.v1beta1.MsgDelegate",
                })
              ).finish(),
            },
            expiration: Timestamp.fromPartial({
              seconds: new Date(grant.expiration).getTime() / 1000,
              nanos: 0,
            }),
          },
        }),
    },
  };
}
