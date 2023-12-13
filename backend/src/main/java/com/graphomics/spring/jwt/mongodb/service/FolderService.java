package com.graphomics.spring.jwt.mongodb.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.graphomics.spring.jwt.mongodb.models.FileItem;

public class FolderService {

    public FileItem getFolderStructure(String rootPath) {
        FileItem root = new FileItem();
        File rootDir = new File(rootPath);
        root.setName(rootDir.getName());
        root.setType("folder");
        root.setChildren(getChildren(rootDir));
        return root;
    }

    private List<FileItem> getChildren(File dir) {
        File[] files = dir.listFiles();
        List<FileItem> children = new ArrayList<>();
        if (files != null) {
            for (File file : files) {
                FileItem item = new FileItem();
                item.setName(file.getName());
                if (file.isDirectory()) {
                    item.setType("folder");
                    item.setChildren(getChildren(file));
                } else {
                    item.setType("file");
                }
                children.add(item);
            }
        }
        return children;
    }
}

