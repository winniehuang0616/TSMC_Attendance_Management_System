import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/components/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@/context/authContext";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Login API call
      const loginResponse = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          employeeId,
          password,
        }),
      });

      if (loginResponse.status === 200) {
        // Get user info after successful login
        const userInfoResponse = await fetch(
          API_ENDPOINTS.USER_INFO(employeeId),
        );
        const userInfo = await userInfoResponse.json();

        // Store employeeId in localStorage if remember password is checked
        if (rememberPassword) {
          localStorage.setItem("rememberedEmployeeId", employeeId);
        } else {
          localStorage.removeItem("rememberedEmployeeId");
        }

        // Login context update with user info
        login(userInfo.userId, userInfo.userName, userInfo.role);

        // Route based on role
        if (userInfo.role.toLowerCase() === "manager") {
          navigate("/approval");
        } else {
          navigate("/apply-form");
        }

        toast({
          title: "登入成功",
          description: `歡迎回來，${userInfo.userId}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "登入失敗",
          description: "請確認您的員工編號和密碼是否正確",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "系統錯誤",
        description: "請稍後再試",
      });
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberPassword"
              checked={rememberPassword}
              onCheckedChange={(checked) =>
                setRememberPassword(checked === true)
              }
              disabled={isLoading}
            />
            <Label htmlFor="rememberPassword" className="font-normal">
              記住密碼
            </Label>
          </div>

          <Button
            type="submit"
            className="w-[20%] bg-blue hover:bg-blue/90"
            disabled={isLoading}
          >
            {isLoading ? "登入中..." : "登入"}
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
