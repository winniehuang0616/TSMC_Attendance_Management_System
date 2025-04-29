import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/authContext";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", {
      employeeId,
      password,
      rememberPassword,
    });
    // 透過 api 取得登入資訊
    login("winnie", "manager");
    navigate("/apply-form");
  };

  return (
    <Card className="w-2/3 shadow-element">
      <CardContent className="pt-6">
        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="employeeId" className="font-semibold">
              員工編號
            </Label>
            <Input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold">
              密碼
            </Label>
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
              onCheckedChange={(checked) =>
                setRememberPassword(checked === true)
              }
            />
            <Label htmlFor="rememberPassword" className="font-normal">
              記住密碼
            </Label>
          </div>

          <Button type="submit" className="w-[20%] bg-blue hover:bg-blue/90">
            登入
          </Button>

          <div>
            <a href="#" className="text-sm text-gray hover:underline">
              忘記密碼？
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
