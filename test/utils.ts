import { client } from "./setup";

export async function increaseTime(seconds: number) {
    await client.increaseTime({
        seconds,
    });
    await client.mine({
        blocks: 1,
    });
}
