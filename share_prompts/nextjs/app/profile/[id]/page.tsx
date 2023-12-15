"use client";

import Profile from "@components/Profile";
import { PopulatedPrompt } from "@types";
import { useSearchParams, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const UserProfile = ({ params }: { params: { id: string } }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name")!;
  const [posts, setPosts] = useState<PopulatedPrompt[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params.id}/posts`);
      const data = await response.json();

      setPosts(data);
    };

    if (params.id) {
      fetchPosts();
    }
  }, []);

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized profile page`}
      data={posts}
    ></Profile>
  );
};

export default UserProfile;
