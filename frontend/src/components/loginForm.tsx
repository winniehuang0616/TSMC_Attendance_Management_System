import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

const LoginForm: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { employeeId, password, rememberPassword });
    // 實際應用中，這裡會發送認證請求到後端
    // 認證成功後導向到請假記錄頁面
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="employeeId">員工編號</Label>
            <Input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密碼</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberPassword"
              checked={rememberPassword}
              onCheckedChange={(checked) => setRememberPassword(checked === true)}
            />
            <Label htmlFor="rememberPassword" className="font-normal">記住密碼</Label>
          </div>
          
          <Button type="submit" className="w-full">登入</Button>
          
          <div className="text-center">
            <a href="#" className="text-blue-600 text-sm hover:underline">
              忘記密碼？
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default LoginForm;