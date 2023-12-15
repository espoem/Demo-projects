"use client";

import React, { useEffect, useMemo } from "react";
import PromptCard from "./PromptCard";
import { PopulatedPrompt } from "@types";
import { useSession } from "next-auth/react";

interface PromptCardListProps {
  data: PopulatedPrompt[];
  handleTagClick: Parameters<typeof PromptCard>[0]["handleTagClick"];
}

const PromptCardList = ({ data, handleTagClick }: PromptCardListProps) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = React.useState<PopulatedPrompt[]>([]);

  const [searchText, setSearchText] = React.useState("");

  const searchedPrompts = useMemo(() => {
    const pattern = new RegExp(searchText, "i");
    return posts.filter(
      (post) =>
        pattern.test(post.prompt) ||
        pattern.test(post.creator.username) ||
        pattern.test(post.tag)
    );
  }, [posts, searchText]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleTagEdit = (tag: string): void => {
    setSearchText(tag);
  };

  return (
    <section className="feed">
      <form
        className="relative w-full flex-center"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="form_input peer"
        ></input>
      </form>

      <PromptCardList data={searchedPrompts} handleTagClick={handleTagEdit} />
    </section>
  );
};

export default Feed;
