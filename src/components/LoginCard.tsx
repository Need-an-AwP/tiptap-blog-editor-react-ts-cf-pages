import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Toolbar } from '@/components/ui/Toolbar'
import { Icon } from '@/components/ui/Icon'

export const LoginCard = ({ workerAPI, setNeedsLogin, token }: { workerAPI: string, setNeedsLogin: (needsLogin: boolean) => void, token: string }) => {
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [tokenExpired, setTokenExpired] = useState(false)

    useEffect(() => {
        const checkExistingToken = async () => {
            setIsLoading(true)
            if (token.length > 0) {
                try {
                    const res = await fetch(`${workerAPI}/api/verify_token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    const data = await res.json();
                    if (data.success) {
                        console.log('token verified')
                        setNeedsLogin(false);
                    } else {
                        localStorage.removeItem('authToken');
                        setTokenExpired(true)
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                    localStorage.removeItem('authToken');
                    setTokenExpired(true)
                }
            } else {
                // no token found enter a new login process
            }
            setIsLoading(false);
        };

        checkExistingToken();
    }, [token]);

    const handleLogin = async () => {
        setIsLoading(true)
        const pwd_hash = await encryptPassword(password)
        // console.log('pwd_hash', pwd_hash)
        const res = await fetch(`${workerAPI}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pwd_hash: pwd_hash })
        });
        const data = await res.json();
        // console.log('login response', data)
        if (data.success) {
            console.log('login success', data.token)
            setNeedsLogin(false)
            localStorage.setItem('authToken', data.token)// permanent token for now
        }

        setIsLoading(false)
    }

    async function encryptPassword(password: string) {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', passwordBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-w-full text-left">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>enter your password to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row space-x-2 items-center">
                        <Label htmlFor="pwd">Password</Label>
                        <Input id="pwd" placeholder="a place holder for ur password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {tokenExpired && <p className="text-sm text-red-500 mt-2">token expired, need to login again</p>}
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Toolbar.Button variant="primary" onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? <Icon name="Loader" /> : 'Confirm'}
                    </Toolbar.Button>
                </CardFooter>
            </Card>
        </>
    )
}