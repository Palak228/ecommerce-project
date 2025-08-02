//naive approach 
//Using Sorting - O(n*log n) Time and O(1) Space
#include<unordered_set>
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// int longestConsecutive(vector<int>& arr) {
//         sort(arr.begin(),arr.end());
//         int res=1,count=1;

//         for(int i=0;i<arr.size();i++){
//             if(arr[i]==arr[i-1]){
//                 continue;
//             }
//             if(arr[i]==arr[i-1]+1){
//                 count++''
//             }
//             else{
//                 count=1;
//             }
//             res=max(res,count);
//         }
//         return res;
        
//     }

int longestConsecutive(vector<int>& arr) {
        unordered_set<int> st;
        int res=0;
        for(int val:arr){
            st.insert(val);
        }

        for(int val:arr){
            if(st.find(val)!=st.end()&&st.find(val-1)==st.end()){
                int curr=val;
                int count=0;
                
                while(st.find(curr)!=st.end()){
                    st.erase(curr);
                    curr++;
                    count++;
                }
                res=max(res,count);
            }
        }
        return res;

    }